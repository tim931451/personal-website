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
    d.zone(40, 70, 870, 310, "Orchestration in LangGraph")
    case = d.box(60, 120, 180, 80, "Legal case", "io")
    guard = d.box(270, 120, 190, 80, "Input guardrails", "mine", "PII redaction")
    pipe = d.box(490, 120, 190, 80, "Processing pipeline", "mine", "jurisdiction anchor")
    router = d.box(710, 120, 180, 80, "Router", "mine")
    out = d.box(60, 270, 180, 80, "Draft legal\nopinion", "io")
    cite = d.box(270, 270, 190, 80, "Citation check", "mine")
    review = d.box(490, 270, 190, 80, "Reviewer loop", "mine", "human in the loop")
    agents = d.box(710, 270, 180, 80, "Specialist\nagents", "mine")
    d.arrow([mid_r(case), mid_l(guard)])
    d.arrow([mid_r(guard), mid_l(pipe)])
    d.arrow([mid_r(pipe), mid_l(router)])
    d.arrow([mid_b(router), mid_t(agents)])
    pair(d, agents, review)
    d.arrow([mid_l(review), mid_r(cite)])
    d.arrow([mid_l(cite), mid_r(out)])
    d.zone(40, 450, 420, 290, "Models and quality")
    apertus = d.box(60, 500, 180, 80, "Apertus", "mine", "endpoint routing")
    trace = d.box(260, 500, 180, 80, "Tracing", "mine", "LangSmith")
    evalb = d.box(60, 600, 380, 80, "Evaluation run", "mine", "Apertus vs. commercial model")
    d.text(60, 700, 380, "Test set and LLM-as-a-judge by my teammate", 15, "muted", "center")
    d.zone(490, 450, 420, 290, "Sources")
    mcp = d.box(510, 500, 180, 80, "fedlex-mcp", "mine", "own MCP server")
    retr = d.box(710, 500, 180, 80, "Retrieval", "team", "BM25 + FAISS")
    ingest = d.box(510, 620, 180, 80, "Fedlex ingestion", "team")
    d.arrow([mid_t(ingest), mid_b(mcp)])
    # Fachagenten nutzen Modell, MCP-Server und Retrieval
    d.arrow([(740, 350), (740, 415), (215, 415), (215, 500)], dashed=True)
    d.arrow([(770, 350), (770, 430), (600, 430), mid_t(mcp)], dashed=True)
    d.arrow([(820, 350), (820, 500)], dashed=True)


def pythia(d):
    d.legend(40, 30)
    sme = d.box(40, 180, 160, 90, "SME", "io", "company details")
    d.zone(240, 70, 460, 380, "AI core on AWS Bedrock AgentCore")
    agents = d.box(270, 120, 400, 90, "Seven role agents", "mine")
    gw = d.box(270, 250, 190, 80, "Gateway", "mine", "tools")
    kb = d.box(480, 250, 190, 80, "Knowledge base", "mine")
    gr = d.box(270, 350, 400, 70, "Guardrails", "mine")
    res = d.box(740, 110, 190, 110, "AI maturity\nand use cases", "io", "with business case")
    app = d.box(740, 300, 190, 100, "Streamlit\nweb app", "team", "live demo")
    d.arrow([mid_r(sme), (220, 225), (220, 165), mid_l(agents)])
    d.arrow([(gw[0] + gw[2] / 2, agents[1] + agents[3]), mid_t(gw)])
    d.arrow([(kb[0] + kb[2] / 2, agents[1] + agents[3]), mid_t(kb)])
    d.arrow([mid_r(agents), mid_l(res)])
    d.arrow([mid_b(res), mid_t(app)])


def soc(d):
    d.legend(40, 30, team=False)
    data = d.box(40, 80, 200, 90, "GUIDE dataset", "io", "9.5M evidence records")
    pipe = d.box(290, 80, 200, 90, "Data pipeline", "mine", "leakage check")
    mitre = d.box(540, 80, 200, 90, "Mapping to\nMITRE ATT&CK", "mine")
    onto = d.box(290, 240, 200, 90, "Ontology and\nrule engine", "mine")
    ml = d.box(540, 240, 200, 90, "ML models", "mine", "in progress", dashed=True)
    tri = d.box(790, 160, 150, 90, "Incident\ntriage", "io", "for SMEs")
    d.arrow([mid_r(data), mid_l(pipe)])
    d.arrow([mid_r(pipe), mid_l(mitre)])
    d.arrow([mid_b(pipe), mid_t(onto)])
    d.arrow([(460, 170), (460, 205), (580, 205), (580, 240)])
    d.arrow([mid_r(mitre), (765, 125), (765, 185), (tri[0], 185)])
    d.arrow([mid_r(ml), (765, 285), (765, 225), (tri[0], 225)])
    d.text(290, 350, 450, "All in a reproducible repository", 15, "muted", "center")


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
