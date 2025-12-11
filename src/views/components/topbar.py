import customtkinter as ctk

class TopBar(ctk.CTkFrame):
    def __init__(self, master, user_profile, **kwargs):
        super().__init__(master, **kwargs)
        self.user_profile = user_profile

        # Styles
        self.configure(fg_color="#030712", height=60, corner_radius=0) # gray-950 (or similar very dark)
        # Border bottom
        self.border_bottom = ctk.CTkFrame(self, height=1, fg_color="#1F2937") # gray-800
        self.border_bottom.pack(side="bottom", fill="x")

        # Container for right-aligned items
        self.right_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.right_frame.pack(side="right", padx=20, pady=10)

        # Streak Item
        self.streak_frame = self.create_stat_item(self.right_frame, "🔥", str(self.user_profile.stats["current_streak"]), "#FB923C") # orange-400
        self.streak_frame.pack(side="left", padx=10)

        # Gems Item
        self.gems_frame = self.create_stat_item(self.right_frame, "💎", str(self.user_profile.gems), "#22D3EE") # cyan-400
        self.gems_frame.pack(side="left", padx=10)

    def create_stat_item(self, parent, icon, value, color):
        frame = ctk.CTkFrame(parent, fg_color="transparent")

        icon_label = ctk.CTkLabel(frame, text=icon, font=ctk.CTkFont(size=20), text_color=color)
        icon_label.pack(side="left")

        val_label = ctk.CTkLabel(frame, text=value, font=ctk.CTkFont(size=16, weight="bold"), text_color=color)
        val_label.pack(side="left", padx=(5, 0))

        # Save reference to update later
        frame.val_label = val_label
        return frame

    def update_stats(self):
        # Refresh values from user profile
        self.streak_frame.val_label.configure(text=str(self.user_profile.stats["current_streak"]))
        self.gems_frame.val_label.configure(text=str(self.user_profile.gems))
