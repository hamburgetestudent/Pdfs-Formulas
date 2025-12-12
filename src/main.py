import tkinter as tk
from tkinter import messagebox
import customtkinter as ctk

# Views
from views.pdf_view import PDFGeneratorView
from views.home_view import HomeView # Keeping old HomeView code but not using it? Or reusing parts?
from views.dashboard_view import DashboardView
from views.lesson_view import LessonView
from views.components.sidebar import Sidebar
from views.components.topbar import TopBar

from core.gamification import UserProfile
from core.utils import load_config

# Global Theme
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("PhysiCode")
        self.geometry("1100x700")

        # Data & Config
        self.user_profile = UserProfile()
        self.config = load_config()

        # Layout Grid
        self.grid_columnconfigure(0, weight=0) # Sidebar
        self.grid_columnconfigure(1, weight=1) # Main Content
        self.grid_rowconfigure(0, weight=1)

        # State
        self.current_view_name = "dashboard"
        self.views = {}

        # --- Components ---

        # 1. Sidebar (Left)
        self.sidebar = Sidebar(self, on_navigate=self.navigate)
        self.sidebar.grid(row=0, column=0, sticky="nsew")

        # 2. Main Area (Right)
        self.main_area = ctk.CTkFrame(self, fg_color="#030712", corner_radius=0) # gray-950
        self.main_area.grid(row=0, column=1, sticky="nsew")
        self.main_area.grid_rowconfigure(0, weight=0) # TopBar
        self.main_area.grid_rowconfigure(1, weight=1) # Content
        self.main_area.grid_columnconfigure(0, weight=1)

        # 3. TopBar
        self.topbar = TopBar(self.main_area, self.user_profile)
        self.topbar.grid(row=0, column=0, sticky="ew")

        # 4. Content Container
        self.content_container = ctk.CTkFrame(self.main_area, fg_color="transparent")
        self.content_container.grid(row=1, column=0, sticky="nsew")
        self.content_container.grid_columnconfigure(0, weight=1)
        self.content_container.grid_rowconfigure(0, weight=1)

        # --- Views Initialization ---
        self.init_views()
        self.navigate("dashboard")

    def init_views(self):
        # Dashboard (The Tree)
        self.views["dashboard"] = DashboardView(
            self.content_container,
            on_start_lesson=self.start_lesson
        )

        # PDF Generator (Existing)
        # Note: PDFView might rely on pack/grid internally. We need to ensure it fills `content_container`.
        self.views["pdf_generator"] = PDFGeneratorView(self.content_container)

        # Stats / Profile (Placeholders)
        self.views["stats"] = self.create_placeholder("Clasificación - Próximamente")
        self.views["profile"] = self.create_placeholder("Perfil de Usuario - Próximamente")

    def create_placeholder(self, text):
        frame = ctk.CTkFrame(self.content_container, fg_color="transparent")
        ctk.CTkLabel(frame, text=text, font=ctk.CTkFont(size=24)).pack(expand=True)
        return frame

    def navigate(self, view_name):
        self.current_view_name = view_name

        # If navigating away from lesson, ensure Sidebar/Topbar are visible
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.topbar.grid(row=0, column=0, sticky="ew")

        # Refresh gamification stats in TopBar
        self.topbar.update_stats()
        self.sidebar.set_active(view_name)

        # Clear Content
        for child in self.content_container.winfo_children():
            child.pack_forget()
            child.grid_forget()

        # Show Selected View
        if view_name in self.views:
            view = self.views[view_name]
            view.grid(row=0, column=0, sticky="nsew")
        else:
            print(f"View {view_name} not found")

    def start_lesson(self, title, data, mode):
        # Switch to Lesson View (Fullscreen-ish)
        # Hide Sidebar for focus? Duolingo hides it.
        self.sidebar.grid_forget()
        self.topbar.grid_forget() # Lesson has its own progress header

        # Clear content
        for child in self.content_container.winfo_children():
            child.grid_forget()

        # Create new LessonView instance (fresh state)
        lesson_view = LessonView(
            self.content_container,
            topic_name=title,
            topic_data=data,
            mode=mode,
            on_finish=self.finish_lesson,
            user_profile=self.user_profile
        )
        lesson_view.grid(row=0, column=0, sticky="nsew")

        # Keep track to destroy later? Content container clearing handles it.

    def finish_lesson(self):
        # Return to Dashboard
        self.navigate("dashboard")


if __name__ == "__main__":
    app = App()
    app.mainloop()
