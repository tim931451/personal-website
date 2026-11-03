"""Erzeugt die Excalidraw-Quellen der vier Architekturdiagramme (hell und dunkel).

Nur Komponenten aus den Projektfakten (Spec Abschnitt 7). Akzent = Tims Anteil, neutral = Team.
Aufruf: python3 diagrams/build.py  → diagrams/<slug>.excalidraw und diagrams/<slug>.dark.excalidraw
"""
import json, itertools
from pathlib import Path

OUT = Path(__file__).parent
FONT = 9  # Liberation Sans, wird beim SVG-Export eingebettet

PALETTES = {
    "light": dict(bg="#ffffff", mine_fill="#e3f0ef", mine_stroke="#0f6e6e", team_fill="#f4f4f2",
                  team_stroke="#8f908a", io_fill="#ffffff", io_stroke="#c9c9c3", text="#16181a",
                  muted="#565b60", arrow="#6b7075", accent="#0f6e6e"),
    "dark": dict(bg="#171a1c", mine_fill="#15302e", mine_stroke="#5cc8c0", team_fill="#202427",
                 team_stroke="#6b7177", io_fill="#171a1c", io_stroke="#3d4247", text="#ecedee",
                 muted="#a3a9ae", arrow="#8d9399", accent="#5cc8c0"),
}

_ids = itertools.count(1)


def _base(kind, x, y, w, h, **kw):
    n = next(_ids)
    el = dict(type=kind, id=f"{kind}{n}", x=x, y=y, width=w, height=h, angle=0,
              strokeColor="#000", backgroundColor="transparent", fillStyle="solid",
              strokeWidth=1.5, strokeStyle="solid", roughness=0, opacity=100, seed=n * 97,
              version=1, versionNonce=n * 131, isDeleted=False, groupIds=[], boundElements=None,
              link=None, locked=False, roundness=None, frameId=None, updated=1)
    el.update(kw)
    return el


class Diagram:
    def __init__(self, pal):
        self.p = PALETTES[pal]
        self.els = []

    def text(self, x, y, w, s, size=18, color="text", align="left", weight_lines=1.25):
        lines = s.count("\n") + 1
        self.els.append(_base("text", x, y, w, size * weight_lines * lines, text=s, originalText=s,
                              fontSize=size, fontFamily=FONT, textAlign=align, verticalAlign="top",
                              strokeColor=self.p[color], containerId=None, lineHeight=weight_lines,
                              autoResize=False))

    def box(self, x, y, w, h, label, kind="mine", sub=None, dashed=False):
        fill, stroke = {"mine": ("mine_fill", "mine_stroke"), "team": ("team_fill", "team_stroke"),
                        "io": ("io_fill", "io_stroke")}[kind]
        self.els.append(_base("rectangle", x, y, w, h, strokeColor=self.p[stroke],
                              backgroundColor=self.p[fill], roundness={"type": 3},
                              strokeStyle="dashed" if dashed else "solid"))
        lines = label.count("\n") + 1 + (sub.count("\n") + 1 if sub else 0)
        total = lines * 18 * 1.25
        ty = y + (h - total) / 2
        self.text(x + 8, ty, w - 16, label, 18, "text", "center")
        if sub:
            self.text(x + 8, ty + (label.count("\n") + 1) * 22.5, w - 16, sub, 15, "muted", "center",
                      weight_lines=1.5)
        return (x, y, w, h)

    def arrow(self, pts, dashed=False, both=False):
        x0, y0 = pts[0]
        rel = [[px - x0, py - y0] for px, py in pts]
        xs = [p[0] for p in rel]; ys = [p[1] for p in rel]
        self.els.append(_base("arrow", x0, y0, max(xs) - min(xs), max(ys) - min(ys), points=rel,
                              strokeColor=self.p["arrow"], strokeStyle="dashed" if dashed else "solid",
                              startArrowhead="triangle" if both else None, endArrowhead="triangle",
                              lastCommittedPoint=None, startBinding=None, endBinding=None,
                              elbowed=False))

    def zone(self, x, y, w, h, title):
        self.els.append(_base("rectangle", x, y, w, h, strokeColor=self.p["io_stroke"],
                              backgroundColor="transparent", strokeStyle="dashed", strokeWidth=1,
                              roundness={"type": 3}))
        self.text(x + 16, y + 12, w - 32, title, 15, "muted")

    def legend(self, x, y, team=True):
        self.box(x, y, 26, 18, "", "mine")
        self.text(x + 36, y - 1, 120, "My part", 15, "muted")
        if team:
            self.box(x + 130, y, 26, 18, "", "team")
            self.text(x + 166, y - 1, 120, "Team", 15, "muted")

    def save(self, path):
        doc = dict(type="excalidraw", version=2, source="personal-website/diagrams/build.py",
                   elements=self.els, appState=dict(viewBackgroundColor=self.p["bg"], gridSize=None),
                   files={})
        path.write_text(json.dumps(doc, indent=1), encoding="utf-8")


def mid_r(b): return (b[0] + b[2], b[1] + b[3] / 2)
def mid_l(b): return (b[0], b[1] + b[3] / 2)
def mid_b(b): return (b[0] + b[2] / 2, b[1] + b[3])
def mid_t(b): return (b[0] + b[2] / 2, b[1])


def pair(d, a, b):
    """Zwei parallele Pfeile für einen Hin-und-zurück-Austausch zwischen horizontal benachbarten Boxen (b links von a)."""
    d.arrow([(a[0], a[1] + a[3] * 0.35), (b[0] + b[2], b[1] + b[3] * 0.35)])
    d.arrow([(b[0] + b[2], b[1] + b[3] * 0.65), (a[0], a[1] + a[3] * 0.65)])


def swiss_legal_agent(d):
    d.legend(40, 30)
    d.zone(40, 70, 870, 500, "Orchestration in LangGraph")
    d.box(55, 105, 835, 36, "Jurisdiction anchor in every agent prompt: Swiss federal law only", "mine")
    case = d.box(55, 160, 205, 80, "Legal case", "io")
    guard = d.box(300, 160, 230, 80, "Input guardrails", "mine", "PII redaction,\njailbreak detection")
    router = d.box(715, 160, 175, 80, "Router", "mine", "off-topic check")
    draft = d.box(55, 300, 205, 100, "Draft opinion", "io", "facts, legal question, norms,\nsubsumption, result, sources")
    review = d.box(300, 300, 165, 100, "Reviewer", "mine")
    cite = d.box(505, 300, 165, 100, "Citation check", "mine", "on error: back\nto the agent")
    agents = d.box(715, 300, 175, 100, "Specialist\nagents", "mine")
    hitl = d.box(300, 470, 370, 70, "Human in the loop", "mine", "low confidence or missing source")
    d.arrow([mid_r(case), mid_l(guard)])
    d.arrow([mid_r(guard), mid_l(router)])
    d.arrow([mid_b(router), mid_t(agents)])
    pair(d, agents, cite)
    d.arrow([mid_l(cite), mid_r(review)])
    d.arrow([mid_l(review), mid_r(draft)])
    d.arrow([(382, 300), (382, 270), (745, 270), (745, 300)])
    d.text(400, 274, 300, "back to the agents, max. 2x", 15, "muted")
    d.arrow([(382, 400), (382, 470)], dashed=True)
    d.arrow([(587, 400), (587, 470)], dashed=True)
    d.zone(40, 610, 420, 330, "Models and quality")
    apertus = d.box(60, 660, 190, 80, "Apertus", "mine", "endpoint routing")
    d.box(270, 660, 170, 80, "Tracing", "mine", "LangSmith")
    evalb = d.box(60, 760, 380, 70, "Evaluation run", "mine", "Apertus vs. commercial model")
    tset = d.box(60, 860, 180, 60, "Test set", "team")
    judge = d.box(260, 860, 180, 60, "LLM-as-a-judge", "team")
    d.arrow([mid_t(tset), (150, 830)])
    d.arrow([mid_t(judge), (350, 830)])
    d.zone(490, 610, 420, 330, "Sources")
    mcp = d.box(510, 660, 180, 80, "fedlex-mcp", "mine", "own MCP server")
    retr = d.box(710, 660, 180, 80, "Retrieval", "team", "BM25 + FAISS")
    ingest = d.box(710, 780, 180, 70, "Fedlex ingestion", "team")
    d.arrow([mid_t(ingest), mid_b(retr)])
    d.arrow([(735, 400), (735, 585), (215, 585), (215, 660)])
    d.arrow([(775, 400), (775, 600), (600, 600), mid_t(mcp)], dashed=True)
    d.text(610, 618, 80, "planned", 15, "muted")
    d.arrow([(815, 400), (815, 660)])


def pythia(d):
    d.legend(40, 30)
    app = d.box(40, 200, 170, 100, "Streamlit\nweb app", "team", "live demo")
    d.zone(250, 170, 640, 330, "AI core on AWS Bedrock AgentCore")
    guard = d.box(280, 220, 170, 80, "Guardrail", "mine", "user input")
    agents = d.box(490, 220, 370, 80, "Seven role agents", "mine")
    d.box(490, 380, 175, 80, "Gateway", "mine", "tools")
    d.box(685, 380, 175, 80, "Knowledge base", "mine")
    d.arrow([(app[0] + app[2], 260), (guard[0], 260)])
    d.arrow([mid_r(guard), mid_l(agents)])
    d.arrow([(577, 300), (577, 380)])
    d.arrow([(772, 300), (772, 380)])
    d.arrow([(675, 220), (675, 130), (125, 130), (125, 200)])
    d.text(150, 100, 520, "Result: AI maturity and use cases with business case", 15, "muted")


def soc(d):
    d.legend(40, 30, team=False)
    data = d.box(40, 140, 190, 90, "GUIDE dataset", "io", "9.5M evidence records")
    pipe = d.box(270, 140, 190, 90, "Data pipeline", "mine", "leakage check")
    d.zone(500, 80, 410, 190, "Ontology and rule engine")
    mitre = d.box(520, 140, 180, 90, "MITRE ATT&CK\nmapping", "mine")
    d.box(715, 140, 175, 90, "Rule engine", "mine")
    ml = d.box(520, 360, 220, 90, "ML models", "mine", "in progress", dashed=True)
    tri = d.box(790, 360, 120, 90, "Incident\ntriage", "io")
    d.arrow([mid_r(data), mid_l(pipe)])
    d.arrow([mid_r(pipe), mid_l(mitre)])
    d.arrow([(610, 270), (610, 360)], dashed=True)
    d.text(620, 300, 260, "ontology features (planned)", 15, "muted")
    d.arrow([(365, 230), (365, 405), mid_l(ml)])
    d.arrow([mid_r(ml), mid_l(tri)])
    d.text(40, 480, 870, "All in a reproducible repository", 15, "muted", "center")


def james(d):
    d.legend(40, 30, team=False)
    d.zone(40, 70, 330, 340, "Local on the Mac")
    mic = d.box(70, 120, 270, 60, "Voice input (German)", "io")
    wake = d.box(70, 210, 270, 70, "Wake word", "mine", "openWakeWord")
    asr = d.box(70, 310, 270, 70, "Speech recognition", "mine", "Parakeet MLX")
    llm = d.box(420, 210, 240, 100, "Claude API", "mine", "tool use")
    tools = d.box(710, 100, 230, 100, "Tools", "mine", "weather, news,\nweb search")
    conf = d.box(710, 260, 230, 100, "Write actions", "mine", "only after spoken\nconfirmation")
    tts = d.box(420, 400, 240, 100, "Speech output", "mine", "ElevenLabs, local\nPiper as fallback")
    d.arrow([mid_b(mic), mid_t(wake)])
    d.arrow([mid_b(wake), mid_t(asr)])
    d.arrow([mid_r(asr), (395, 345), (395, 260), mid_l(llm)])
    d.arrow([(660, 240), (685, 240), (685, 150), mid_l(tools)])
    d.arrow([(660, 280), (685, 280), (685, 310), mid_l(conf)])
    d.arrow([mid_b(llm), mid_t(tts)])
    d.text(690, 440, 250, "About 1.7 s to first audio", 15, "accent", "left")


DIAGRAMS = {"swiss-legal-agent": swiss_legal_agent, "pythia": pythia,
            "soc-triage-assistant": soc, "james": james}

if __name__ == "__main__":
    for slug, fn in DIAGRAMS.items():
        for pal in ("light", "dark"):
            d = Diagram(pal)
            fn(d)
            d.save(OUT / (f"{slug}.excalidraw" if pal == "light" else f"{slug}.dark.excalidraw"))
    print("ok")
