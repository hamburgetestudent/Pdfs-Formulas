import customtkinter as ctk
from quiz_data import load_quiz_db

class DashboardView(ctk.CTkScrollableFrame):
    """
    The 'Tree' view where Units (Categories) and Lessons (Topics/Nodes) are displayed.
    """
    def __init__(self, master, on_start_lesson, **kwargs):
        super().__init__(master, **kwargs)
        self.on_start_lesson = on_start_lesson # Callback(unit_name, lesson_data, mode)

        self.configure(fg_color="transparent") # Inherit bg

        self.quiz_data = load_quiz_db()
        self.flattened_units = self._flatten_data()

        self._build_ui()

    def _flatten_data(self):
        """
        Transforms the hierarchical `quiz_db` into a linear list of Units.
        Structure: Subject -> Category (UNIT) -> Topic (LESSON NODE)
        """
        units = []
        # quiz_data structure: { "Física": { "Mecánica": { "Cinemática": { ... } } } }

        for subject, categories in self.quiz_data.items():
            for category_name, topics in categories.items():

                # Each Category is a Unit
                unit = {
                    "title": f"Unidad: {category_name}",
                    "description": f"Temas de {subject}", # Simple description
                    "color": ("#3B82F6", "#22D3EE"), # Gradient colors (Simulated by passing tuple)
                    "lessons": []
                }

                # Each Topic is a Lesson Node (or set of nodes)
                # To make it look like a path, we assign positions: left, center, right
                positions = ['center', 'left', 'center', 'right']

                idx = 0
                for topic_name, content in topics.items():
                    # We create a "Study" node and a "Practice" node for each topic to extend the tree

                    # Node 1: Study (Formulas)
                    pos = positions[idx % len(positions)]
                    unit["lessons"].append({
                        "id": f"{category_name}_{topic_name}_study",
                        "title": topic_name,
                        "type": "formulas",
                        "data": content, # Pass the whole content dict
                        "locked": False, # TODO: Implement locking logic based on progress
                        "completed": False, # TODO: Check user profile
                        "position": pos,
                        "icon": "📖"
                    })
                    idx += 1

                    # Node 2: Practice (Questions)
                    pos = positions[idx % len(positions)]
                    unit["lessons"].append({
                        "id": f"{category_name}_{topic_name}_quiz",
                        "title": "Práctica",
                        "type": "questions",
                        "data": content,
                        "locked": False,
                        "completed": False,
                        "position": pos,
                        "icon": "⚡"
                    })
                    idx += 1

                units.append(unit)

        return units

    def _build_ui(self):
        # Center container
        self.container = ctk.CTkFrame(self, fg_color="transparent")
        self.container.pack(fill="both", expand=True, padx=20)

        # We need to center the content horizontally
        self.container.grid_columnconfigure(0, weight=1)
        self.container.grid_columnconfigure(1, weight=0) # The path column
        self.container.grid_columnconfigure(2, weight=1)

        row_idx = 0

        for unit in self.flattened_units:
            # Unit Header
            self._create_unit_header(unit, row_idx)
            row_idx += 1

            # Lessons Path
            for lesson in unit["lessons"]:
                self._create_lesson_node(lesson, row_idx)
                row_idx += 1

            # Spacer between units
            spacer = ctk.CTkFrame(self.container, height=50, fg_color="transparent")
            spacer.grid(row=row_idx, column=1, pady=20)
            row_idx += 1

    def _create_unit_header(self, unit, row):
        # Card style header
        header = ctk.CTkFrame(
            self.container,
            fg_color="#3B82F6", # blue-500 equivalent base
            corner_radius=15,
            width=500, # Fixed max width similar to example
            height=100
        )
        header.grid(row=row, column=1, pady=(0, 40), sticky="ew")
        header.grid_propagate(False) # Respect size

        # Title
        ctk.CTkLabel(
            header,
            text=unit["title"],
            font=ctk.CTkFont(size=20, weight="bold"),
            text_color="white"
        ).place(x=20, y=20)

        # Desc
        ctk.CTkLabel(
            header,
            text=unit["description"],
            font=ctk.CTkFont(size=14),
            text_color="#DBEAFE" # blue-100
        ).place(x=20, y=55)

    def _create_lesson_node(self, lesson, row):
        # Position logic
        # We can use padding to simulate the curve
        # center: padx=0
        # left: padx=(0, 100) ? No, grid alignment.
        # Let's use a frame that holds the button and use pack with side or anchors.

        frame = ctk.CTkFrame(self.container, fg_color="transparent")
        frame.grid(row=row, column=1, sticky="ew", pady=10)

        # Determine alignment
        anchor = "center"
        if lesson["position"] == "left":
            anchor = "w"
        elif lesson["position"] == "right":
            anchor = "e"

        # Button Color based on state
        # Active: cyan (#22D3EE), Locked: gray (#374151), Completed: yellow (#FACC15)
        # For now defaults to Active style for simplicity as locking isn't fully implemented in data
        bg_color = "#22D3EE" # cyan
        hover_color = "#06B6D4" # cyan-500
        text_color = "white"

        if lesson["locked"]:
            bg_color = "#374151" # gray-700
            hover_color = "#374151"
            text_color = "#9CA3AF"
        elif lesson["completed"]:
            bg_color = "#FACC15" # yellow-400
            hover_color = "#EAB308"
            text_color = "#713F12"

        # Circular Button
        size = 70
        btn = ctk.CTkButton(
            frame,
            text=lesson["icon"],
            font=ctk.CTkFont(size=30),
            width=size, height=size,
            corner_radius=size//2,
            fg_color=bg_color,
            hover_color=hover_color,
            text_color=text_color,
            # Border for 3D effect
            border_width=0,
            command=lambda l=lesson: self.on_start_lesson(l["title"], l["data"], l["type"])
        )

        # Apply offset for left/right using pack padding
        pad_x = 0
        if lesson["position"] == "left":
            pad_x = (0, 100) # Push to left (relative to center? No, this pushes from right)
            # Actually, to align left in a center column, we need to control the frame's internal alignment
            btn.pack(side="top", padx=(0, 150)) # Shift left
        elif lesson["position"] == "right":
            btn.pack(side="top", padx=(150, 0)) # Shift right
        else:
            btn.pack(side="top") # Center

        # Shadow/3D bottom part (simulated with a frame behind? or just simple button for now)
        # CTkButton doesn't support complex borders easily. We stick to flat/rounded.
