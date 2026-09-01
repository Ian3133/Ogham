using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;
using Windows.Globalization;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage.Streams;

namespace OghamScreenCapture
{
    internal static class Program
    {
        private const string CaptureUrl = "https://main.d39wc75md4exup.amplifyapp.com/#capture";

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool EnumWindows(EnumWindowsCallback callback, IntPtr parameter);

        [DllImport("user32.dll")]
        private static extern bool IsWindowVisible(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

        [DllImport("user32.dll")]
        private static extern bool SetProcessDpiAwarenessContext(IntPtr dpiContext);

        private delegate bool EnumWindowsCallback(IntPtr hWnd, IntPtr parameter);

        [STAThread]
        private static int Main(string[] args)
        {
            try
            {
                SetProcessDpiAwarenessContext(new IntPtr(-4));
            }
            catch
            {
            }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            if (args.Length >= 1 && string.Equals(args[0], "--listener", StringComparison.OrdinalIgnoreCase))
            {
                return RunHotkeyListener();
            }
            bool imageMode = args.Length >= 2 && string.Equals(args[0], "--image", StringComparison.OrdinalIgnoreCase);

            try
            {
                Rectangle? selectedArea = null;
                Bitmap sourceImage = null;

                if (imageMode)
                {
                    sourceImage = new Bitmap(args[1]);
                }
                else
                {
                    using (SelectionOverlay overlay = new SelectionOverlay())
                    {
                        Application.Run(overlay);
                        selectedArea = overlay.SelectedScreenArea;
                    }

                    if (!selectedArea.HasValue)
                    {
                        return 0;
                    }

                    sourceImage = CaptureScreenArea(selectedArea.Value);
                }

                string text;
                using (sourceImage)
                {
                    text = RecognizeFrenchText(sourceImage).Trim();
                }

                if (string.IsNullOrWhiteSpace(text))
                {
                    if (imageMode)
                    {
                        WriteImageModeResult(args, "__OGHAM_OCR_ERROR__:No text recognized");
                        return 2;
                    }
                    MessageBox.Show(
                        "No French text was recognized in that area. Try a tighter box with larger, clearer text.",
                        "Ogham Screen Capture",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Information);
                    return 2;
                }

                if (imageMode)
                {
                    WriteImageModeResult(args, text);
                    return 0;
                }

                Clipboard.SetText(text);
                OpenCaptureAndPaste();
                return 0;
            }
            catch (Exception error)
            {
                if (imageMode)
                {
                    try
                    {
                        WriteImageModeResult(args, "__OGHAM_OCR_ERROR__:" + error.Message);
                    }
                    catch
                    {
                    }
                    return 1;
                }
                MessageBox.Show(
                    "Ogham could not extract this text.\n\n" + error.Message,
                    "Ogham Screen Capture",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);
                return 1;
            }
        }

        private static void WriteImageModeResult(string[] args, string text)
        {
            if (args.Length >= 4 && string.Equals(args[2], "--output", StringComparison.OrdinalIgnoreCase))
            {
                File.WriteAllText(args[3], text);
                return;
            }
            Clipboard.SetText(text);
        }

        private static Bitmap CaptureScreenArea(Rectangle area)
        {
            Bitmap image = new Bitmap(area.Width, area.Height, PixelFormat.Format32bppArgb);
            using (Graphics graphics = Graphics.FromImage(image))
            {
                graphics.CopyFromScreen(area.Location, Point.Empty, area.Size, CopyPixelOperation.SourceCopy);
            }
            return image;
        }

        private static string RecognizeFrenchText(Bitmap bitmap)
        {
            OcrEngine engine = OcrEngine.TryCreateFromLanguage(new Language("fr-FR"));
            if (engine == null)
            {
                engine = OcrEngine.TryCreateFromUserProfileLanguages();
            }
            if (engine == null)
            {
                throw new InvalidOperationException("Windows OCR is unavailable. Install the French OCR language capability and try again.");
            }

            using (InMemoryRandomAccessStream randomAccessStream = new InMemoryRandomAccessStream())
            {
                Stream stream = randomAccessStream.AsStreamForWrite();
                bitmap.Save(stream, ImageFormat.Png);
                stream.Flush();

                randomAccessStream.Seek(0);
                BitmapDecoder decoder = BitmapDecoder.CreateAsync(randomAccessStream).AsTask().GetAwaiter().GetResult();
                SoftwareBitmap softwareBitmap = decoder.GetSoftwareBitmapAsync(
                    BitmapPixelFormat.Bgra8,
                    BitmapAlphaMode.Premultiplied).AsTask().GetAwaiter().GetResult();

                using (softwareBitmap)
                {
                    OcrResult result = engine.RecognizeAsync(softwareBitmap).AsTask().GetAwaiter().GetResult();
                    string recognizedText = result.Text ?? string.Empty;
                    stream.Dispose();
                    return recognizedText;
                }
            }
        }

        private static void OpenCaptureAndPaste()
        {
            string chromePath = FindChromePath();
            HashSet<IntPtr> existingChromeWindows = GetChromeTopLevelWindows();
            Process.Start(new ProcessStartInfo
            {
                FileName = chromePath,
                Arguments = "--app=\"" + CaptureUrl + "\"",
                UseShellExecute = true
            });

            IntPtr window = IntPtr.Zero;
            for (int attempt = 0; attempt < 30 && window == IntPtr.Zero; attempt++)
            {
                Thread.Sleep(200);
                window = GetChromeTopLevelWindows()
                    .FirstOrDefault(handle => !existingChromeWindows.Contains(handle));
            }

            if (window != IntPtr.Zero)
            {
                SetForegroundWindow(window);
                Thread.Sleep(700);
                SendKeys.SendWait("^v");
                return;
            }

            MessageBox.Show(
                "The text was copied, but Ogham's new window could not be focused automatically. Click the Capture box and press Ctrl+V.",
                "Ogham Screen Capture",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }

        private static HashSet<IntPtr> GetChromeTopLevelWindows()
        {
            HashSet<IntPtr> windows = new HashSet<IntPtr>();
            EnumWindows(delegate(IntPtr window, IntPtr parameter)
            {
                if (!IsWindowVisible(window))
                {
                    return true;
                }

                uint processId;
                GetWindowThreadProcessId(window, out processId);
                try
                {
                    using (Process process = Process.GetProcessById((int)processId))
                    {
                        if (string.Equals(process.ProcessName, "chrome", StringComparison.OrdinalIgnoreCase))
                        {
                            windows.Add(window);
                        }
                    }
                }
                catch
                {
                }
                return true;
            }, IntPtr.Zero);
            return windows;
        }

        private static int RunHotkeyListener()
        {
            bool ownsMutex;
            using (Mutex listenerMutex = new Mutex(true, "Local\\OghamScreenCaptureHotkey", out ownsMutex))
            {
                if (!ownsMutex)
                {
                    return 0;
                }
                Application.Run(new HotkeyListenerForm());
                return 0;
            }
        }

        private static string FindChromePath()
        {
            string[] candidates =
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Google", "Chrome", "Application", "chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Google", "Chrome", "Application", "chrome.exe")
            };

            string chromePath = candidates.FirstOrDefault(File.Exists);
            if (string.IsNullOrEmpty(chromePath))
            {
                throw new FileNotFoundException("Google Chrome was not found in a standard installation folder.");
            }
            return chromePath;
        }
    }

    internal sealed class HotkeyListenerForm : Form
    {
        private const int HotkeyId = 0x4F47;
        private const int WmHotkey = 0x0312;
        private const uint ModifierAlt = 0x0001;
        private const uint ModifierControl = 0x0002;
        private const uint KeyC = 0x43;

        [DllImport("user32.dll")]
        private static extern bool RegisterHotKey(IntPtr hWnd, int id, uint modifiers, uint virtualKey);

        [DllImport("user32.dll")]
        private static extern bool UnregisterHotKey(IntPtr hWnd, int id);

        public HotkeyListenerForm()
        {
            ShowInTaskbar = false;
            FormBorderStyle = FormBorderStyle.FixedToolWindow;
            WindowState = FormWindowState.Minimized;
            Opacity = 0;
        }

        protected override void OnHandleCreated(EventArgs eventArgs)
        {
            base.OnHandleCreated(eventArgs);
            if (!RegisterHotKey(Handle, HotkeyId, ModifierControl | ModifierAlt, KeyC))
            {
                MessageBox.Show(
                    "Ctrl+Alt+C is already being used by another program. Ogham Screen Capture can still be opened from its desktop shortcut.",
                    "Ogham Screen Capture",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning);
                BeginInvoke(new Action(Close));
            }
        }

        protected override void OnHandleDestroyed(EventArgs eventArgs)
        {
            UnregisterHotKey(Handle, HotkeyId);
            base.OnHandleDestroyed(eventArgs);
        }

        protected override void SetVisibleCore(bool value)
        {
            base.SetVisibleCore(false);
        }

        protected override void WndProc(ref Message message)
        {
            if (message.Msg == WmHotkey && message.WParam.ToInt32() == HotkeyId)
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = Assembly.GetExecutingAssembly().Location,
                    UseShellExecute = true
                });
                return;
            }
            base.WndProc(ref message);
        }
    }

    internal sealed class SelectionOverlay : Form
    {
        private Point dragStart;
        private Point dragCurrent;
        private bool dragging;

        public Rectangle? SelectedScreenArea { get; private set; }

        public SelectionOverlay()
        {
            Bounds = SystemInformation.VirtualScreen;
            FormBorderStyle = FormBorderStyle.None;
            StartPosition = FormStartPosition.Manual;
            TopMost = true;
            ShowInTaskbar = true;
            Text = "Ogham Screen Capture";
            BackColor = Color.Black;
            Opacity = 0.28;
            Cursor = Cursors.Cross;
            DoubleBuffered = true;
            KeyPreview = true;
        }

        protected override void OnShown(EventArgs eventArgs)
        {
            base.OnShown(eventArgs);
            Activate();
        }

        protected override void OnKeyDown(KeyEventArgs eventArgs)
        {
            if (eventArgs.KeyCode == Keys.Escape)
            {
                SelectedScreenArea = null;
                Close();
                return;
            }
            base.OnKeyDown(eventArgs);
        }

        protected override void OnMouseDown(MouseEventArgs eventArgs)
        {
            if (eventArgs.Button == MouseButtons.Left)
            {
                dragStart = eventArgs.Location;
                dragCurrent = eventArgs.Location;
                dragging = true;
                Invalidate();
            }
            base.OnMouseDown(eventArgs);
        }

        protected override void OnMouseMove(MouseEventArgs eventArgs)
        {
            if (dragging)
            {
                dragCurrent = eventArgs.Location;
                Invalidate();
            }
            base.OnMouseMove(eventArgs);
        }

        protected override void OnMouseUp(MouseEventArgs eventArgs)
        {
            if (!dragging || eventArgs.Button != MouseButtons.Left)
            {
                base.OnMouseUp(eventArgs);
                return;
            }

            dragging = false;
            dragCurrent = eventArgs.Location;
            Rectangle localArea = NormalizeRectangle(dragStart, dragCurrent);
            if (localArea.Width < 8 || localArea.Height < 8)
            {
                Invalidate();
                return;
            }

            SelectedScreenArea = new Rectangle(
                localArea.X + Bounds.X,
                localArea.Y + Bounds.Y,
                localArea.Width,
                localArea.Height);
            Close();
            base.OnMouseUp(eventArgs);
        }

        protected override void OnPaint(PaintEventArgs eventArgs)
        {
            base.OnPaint(eventArgs);
            if (!dragging)
            {
                return;
            }

            Rectangle selection = NormalizeRectangle(dragStart, dragCurrent);
            using (Brush clearBrush = new SolidBrush(Color.FromArgb(210, Color.White)))
            using (Pen borderPen = new Pen(Color.FromArgb(39, 108, 99), 3))
            {
                eventArgs.Graphics.FillRectangle(clearBrush, selection);
                eventArgs.Graphics.DrawRectangle(borderPen, selection);
            }
        }

        private static Rectangle NormalizeRectangle(Point first, Point second)
        {
            int left = Math.Min(first.X, second.X);
            int top = Math.Min(first.Y, second.Y);
            int right = Math.Max(first.X, second.X);
            int bottom = Math.Max(first.Y, second.Y);
            return Rectangle.FromLTRB(left, top, right, bottom);
        }
    }
}
