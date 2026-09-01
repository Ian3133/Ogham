using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
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
        private static extern bool SetProcessDpiAwarenessContext(IntPtr dpiContext);

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
                window = Process.GetProcessesByName("chrome")
                    .Where(process => process.MainWindowHandle != IntPtr.Zero)
                    .OrderByDescending(process => SafeStartTime(process))
                    .Select(process => process.MainWindowHandle)
                    .FirstOrDefault();
            }

            if (window != IntPtr.Zero)
            {
                SetForegroundWindow(window);
                Thread.Sleep(700);
                SendKeys.SendWait("^v");
            }
        }

        private static DateTime SafeStartTime(Process process)
        {
            try
            {
                return process.StartTime;
            }
            catch
            {
                return DateTime.MinValue;
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
