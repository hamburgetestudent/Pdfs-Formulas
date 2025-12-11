import customtkinter as ctk

class Sidebar(ctk.CTkFrame):
    def __init__(self, master, on_navigate, **kwargs):
        super().__init__(master, **kwargs)
        self.on_navigate = on_navigate

        # Styles
        self.configure(fg_color="#111827", width=260, corner_radius=0) # gray-900
        self.grid_rowconfigure(6, weight=1) # Spacer at bottom

        # Header / Logo
        self.logo_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.logo_frame.grid(row=0, column=0, padx=20, pady=30, sticky="ew")

        # Icono Terminal simulado con CTkLabel
        # En el ejemplo era bg-gradient purple-indigo. Usaremos un color sólido púrpura.
        self.logo_icon = ctk.CTkLabel(
            self.logo_frame,
            text="⚡", # Terminal/Zap icon replacement
            font=ctk.CTkFont(size=24),
            fg_color="#8B5CF6", # purple-500
            width=40, height=40,
            corner_radius=8
        )
        self.logo_icon.pack(side="left")

        self.logo_text = ctk.CTkLabel(
            self.logo_frame,
            text="PhysiCode",
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="white"
        )
        self.logo_text.pack(side="left", padx=10)

        # Navigation Buttons
        self.nav_buttons = []

        items = [
            ("Aprender", "dashboard", "📖"),
            ("Clasificación", "stats", "🏆"),
            ("Generador PDF", "pdf_generator", "📄"),
            ("Perfil", "profile", "👤")
        ]

        for idx, (label, view_name, icon) in enumerate(items):
            btn = self.create_nav_button(label, view_name, icon, idx + 1)
            self.nav_buttons.append(btn)

    def create_nav_button(self, label, view_name, icon, row):
        # State management for visual activation is handled by parent or updating styles here
        # For now, simplistic button
        btn = ctk.CTkButton(
            self,
            text=f"  {icon}   {label}",
            anchor="w",
            font=ctk.CTkFont(size=16, weight="bold"),
            fg_color="transparent",
            text_color="#9CA3AF", # gray-400
            hover_color="#1F2937", # gray-800
            height=50,
            command=lambda v=view_name: self.handle_click(v)
        )
        btn.grid(row=row, column=0, padx=10, pady=5, sticky="ew")
        btn.view_name = view_name # Store tag
        return btn

    def handle_click(self, view_name):
        self.set_active(view_name)
        self.on_navigate(view_name)

    def set_active(self, view_name):
        for btn in self.nav_buttons:
            if btn.view_name == view_name:
                btn.configure(
                    fg_color="#1F2937", # bg-gray-800
                    text_color="#22D3EE", # text-cyan-400
                    border_width=1,
                    border_color="#374151" # border-gray-700
                )
            else:
                btn.configure(
                    fg_color="transparent",
                    text_color="#9CA3AF",
                    border_width=0
                )
