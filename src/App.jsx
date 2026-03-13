import { removeBackground } from "@imgly/background-removal";
import { useEffect, useState } from "react";

export default function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (originalImage) URL.revokeObjectURL(originalImage);
      if (resultImage) URL.revokeObjectURL(resultImage);
    };
  }, []);

  const processImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large! Max 10MB");
      return;
    }

    if (originalImage) URL.revokeObjectURL(originalImage);
    if (resultImage) URL.revokeObjectURL(resultImage);
    setResultImage(null);
    setIsLoading(true);
    setOriginalImage(URL.createObjectURL(file));

    try {
      const blob = await removeBackground(file);
      setResultImage(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      alert("Failed to remove background");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => processImage(e.target.files?.[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processImage(e.dataTransfer.files?.[0]);
  };

  return (
    <main
      className="min-h-screen text-white px-5 py-14 relative overflow-hidden"
      style={{ background: "#070710", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-1/2 -top-40 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            width: 700,
            height: 420,
            background:
              "radial-gradient(ellipse, #6b3afc 0%, #d040b0 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* HEADER */}
        <header className="mb-14">
          <div
            className="inline-flex items-center gap-2 text-purple-300 text-xs font-medium uppercase tracking-widest mb-5 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(99,60,255,0.14)",
              border: "1px solid rgba(99,60,255,0.32)",
              letterSpacing: "0.08em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            100% Browser-Based · No Server
          </div>

          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none text-white mb-3"
            style={{
              fontFamily: "'Syne', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Remove
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#7c5cfc,#e040cc,#ff6b6b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Backgrounds
            </span>
            <br />
            Instantly.
          </h1>

          <p
            className="text-base mt-2 max-w-md leading-relaxed"
            style={{ color: "rgba(200,200,220,0.5)", fontWeight: 300 }}
          >
            Upload any image and our AI strips the background in seconds —
            privately, locally, for free.
          </p>
        </header>

        {/* UPLOAD ZONE */}
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative rounded-3xl text-center px-10 py-16 transition-all duration-300"
          style={{
            border: isDragging
              ? "1.5px dashed rgba(124,92,252,0.6)"
              : "1.5px dashed rgba(255,255,255,0.1)",
            background: isDragging
              ? "rgba(124,92,252,0.08)"
              : "rgba(255,255,255,0.022)",
          }}
        >

          <h2
            className="text-xl font-bold text-white mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Drop your image here
          </h2>
          <p
            className="text-sm mb-7"
            style={{ color: "rgba(200,200,220,0.4)", fontWeight: 300 }}
          >
            or choose a file from your device
          </p>

          <label
            className="inline-flex items-center gap-2 cursor-pointer text-white text-sm font-medium px-7 py-3 rounded-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #7c5cfc, #e040cc)",
              boxShadow: "0 0 30px rgba(124,92,252,0.35)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1v8M3.5 4.5L7 1l3.5 3.5M2 10.5v1.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            {["PNG", "JPG", "WEBP", "Max 10 MB"].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(200,200,220,0.35)",
                  fontWeight: 300,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* LOADING */}
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div
              className="w-12 h-12 rounded-full border-2 animate-spin"
              style={{
                borderColor: "rgba(124,92,252,0.2)",
                borderTopColor: "#7c5cfc",
              }}
            />
            <p
              className="text-sm tracking-widest"
              style={{ color: "rgba(200,200,220,0.4)", fontWeight: 300 }}
            >
              AI IS WORKING ITS MAGIC...
            </p>
          </div>
        )}

        {/* RESULTS */}
        {(originalImage || resultImage) && (
          <section className="grid sm:grid-cols-2 gap-5 mt-8">
            {originalImage && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                <div
                  className="flex items-center gap-2 px-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: "rgba(200,200,220,0.25)" }}
                  />
                  <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "rgba(200,200,220,0.4)" }}
                  >
                    Original
                  </span>
                </div>
                <div className="p-5 flex items-center justify-center min-h-52">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-h-52 max-w-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}

            {resultImage && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                <div
                  className="flex items-center gap-2 px-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #7c5cfc, #e040cc)",
                    }}
                  />
                  <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "rgba(200,200,220,0.4)" }}
                  >
                    Background Removed
                  </span>
                </div>

                <div
                  className="p-5 flex items-center justify-center min-h-52"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg,rgba(255,255,255,0.03) 25%,transparent 25%),linear-gradient(-45deg,rgba(255,255,255,0.03) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(255,255,255,0.03) 75%),linear-gradient(-45deg,transparent 75%,rgba(255,255,255,0.03) 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
                  }}
                >
                  <img
                    src={resultImage}
                    alt="Result"
                    className="max-h-52 max-w-full object-contain rounded-lg"
                  />
                </div>

                <a
                  href={resultImage}
                  download="background-removed.png"
                  className="flex items-center justify-center gap-2 mx-5 mb-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: "rgba(30,220,130,0.1)",
                    border: "1px solid rgba(30,220,130,0.25)",
                    color: "#4ade80",
                    textDecoration: "none",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path
                      d="M6.5 1v7M3.5 5.5L6.5 8.5l3-3M2 10h9"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Download PNG
                </a>
              </div>
            )}
          </section>
        )}

        {/* FEATURE CHIPS */}
        <section className="grid grid-cols-3 gap-3 mt-10">
          {[
            {
              icon: "🔒",
              title: "Fully Private",
              desc: "Images never leave your device.",
            },
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Runs via WebAssembly in-browser.",
            },
            {
              icon: "🎯",
              title: "Pixel-Perfect",
              desc: "Fine hair, complex backgrounds.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="text-xl mb-3">{icon}</div>
              <div
                className="text-sm font-bold text-white mb-1"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {title}
              </div>
              <div
                className="text-xs leading-relaxed"
                style={{ color: "rgba(200,200,220,0.35)", fontWeight: 300 }}
              >
                {desc}
              </div>
            </div>
          ))}
        </section>

        <footer
          className="text-center mt-14 text-xs tracking-widest"
          style={{ color: "rgba(200,200,220,0.18)", fontWeight: 300 }}
        >
          BUILT WITH REACT + @IMGLY/BACKGROUND-REMOVAL · 100% IN YOUR BROWSER
        </footer>
      </div>
    </main>
  );
}
