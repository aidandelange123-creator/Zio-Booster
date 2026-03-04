"""
Update notification GUI for Zio-Booster
Shows a persistent notification when updates are available
"""

import tkinter as tk
from tkinter import ttk
import webbrowser
import threading
from utils.auto_updater import AutoUpdater


class UpdateNotificationGUI:
    def __init__(self, root, current_version="1.0.0"):
        self.root = root
        self.current_version = current_version
        self.notification_window = None
        self.updater = AutoUpdater(current_version=current_version)
        
    def show_update_notification(self, latest_version, release_url):
        """Show a persistent update notification window"""
        if self.notification_window is not None:
            # If already showing, just update the text
            try:
                self.notification_window.lift()
                self.notification_window.focus_force()
                return
            except tk.TclError:
                # Window was closed, recreate it
                self.notification_window = None
        
        # Create notification window
        self.notification_window = tk.Toplevel(self.root)
        self.notification_window.title("Update Available!")
        
        # Make window stay on top
        self.notification_window.attributes('-topmost', True)
        
        # Remove window decorations to make it truly non-dismissible
        self.notification_window.overrideredirect(True)
        
        # Position the window in the center of the screen
        self.notification_window.geometry("400x200")
        self.center_window_on_screen(self.notification_window)
        
        # Prevent resizing
        self.notification_window.resizable(False, False)
        
        # Create content
        main_frame = tk.Frame(self.notification_window, bg="#FFD700", relief="raised", bd=2)
        main_frame.pack(fill="both", expand=True, padx=1, pady=1)
        
        # Title
        title_label = tk.Label(
            main_frame, 
            text="UPDATE AVAILABLE!", 
            font=("Arial", 16, "bold"), 
            bg="#FFD700", 
            fg="#333333"
        )
        title_label.pack(pady=15)
        
        # Version info
        version_info = tk.Label(
            main_frame, 
            text=f"A new version ({latest_version}) is available!\nYour current version: {self.current_version}", 
            font=("Arial", 12), 
            bg="#FFD700", 
            fg="#333333"
        )
        version_info.pack(pady=5)
        
        # Buttons frame
        button_frame = tk.Frame(main_frame, bg="#FFD700")
        button_frame.pack(pady=15)
        
        # Update button
        update_button = tk.Button(
            button_frame,
            text="Update Now",
            command=lambda: self.open_release_page(release_url),
            bg="#4CAF50",
            fg="white",
            font=("Arial", 12, "bold"),
            width=12,
            cursor="hand2"
        )
        update_button.pack(side="left", padx=5)
        
        # Later button (just minimizes the main window to show the notification better)
        later_button = tk.Button(
            button_frame,
            text="Later",
            command=lambda: self.root.iconify(),  # Minimize main window
            bg="#f44336",
            fg="white",
            font=("Arial", 12),
            width=12,
            cursor="hand2"
        )
        later_button.pack(side="left", padx=5)
        
        # Keep window on top constantly
        self.keep_on_top()
    
    def center_window_on_screen(self, window):
        """Center the window on the screen"""
        window.update_idletasks()
        width = window.winfo_width()
        height = window.winfo_height()
        x = (window.winfo_screenwidth() // 2) - (width // 2)
        y = (window.winfo_screenheight() // 2) - (height // 2)
        window.geometry(f"{width}x{height}+{x}+{y}")
    
    def keep_on_top(self):
        """Keep the notification window on top"""
        if self.notification_window:
            try:
                self.notification_window.lift()
                self.notification_window.focus_force()
                # Schedule next lift operation
                self.notification_window.after(1000, self.keep_on_top)
            except tk.TclError:
                # Window was closed
                self.notification_window = None
    
    def open_release_page(self, release_url):
        """Open the release page in the browser"""
        webbrowser.open(release_url)
    
    def check_for_updates(self):
        """Check for updates in a separate thread"""
        def check():
            is_available, release_info = self.updater.is_new_version_available()
            if is_available and release_info:
                # Get the HTML URL for the release (not the API URL)
                release_html_url = f"https://github.com/{self.updater.repo_owner}/{self.updater.repo_name}/releases"
                self.show_update_notification(release_info['version'], release_html_url)
        
        thread = threading.Thread(target=check, daemon=True)
        thread.start()


def create_update_notifier(root, current_version="1.0.0"):
    """Factory function to create an update notifier"""
    return UpdateNotificationGUI(root, current_version)