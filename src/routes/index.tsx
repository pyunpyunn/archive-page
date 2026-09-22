import { createFileRoute } from "@tanstack/react-router";
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FolderPlus,
  Menu,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Situation Report Archive | Emergency Operations" },
      { name: "description", content: "Review, filter, group, and export emergency operations records." },
      { property: "og:title", content: "Situation Report Archive" },
      { property: "og:description", content: "Emergency operations archive and report workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArchiveWorkspace,
});

const categories = [
  ["disaster-events", "Disaster events", 128],
  ["households", "Affected households", 342],
  ["teams", "Team routes", 96],
  ["transmissions", "Transmissions", 210],
  ["requests", "Resource requests", 54],
  ["sitreps", "Situation reports", 31],
] as const;

const records = [
  { id: "EV-2481", date: "Today — 22 Sep 2026", title: "Typhoon Maring — landfall operations", purok: "Purok 2", type: "Typhoon", status: "Active", updated: "14:08" },
  { id: "EV-2479", date: "Today — 22 Sep 2026", title: "Flash flood — Malinao creek", purok: "Purok 5", type: "Flood", status: "Active", updated: "13:42" },
  { id: "EV-2477", date: "Today — 22 Sep 2026", title: "Landslide watch — eastern slope", purok: "Purok 7", type: "Landslide", status: "Monitoring", updated: "12:55" },
  { id: "EV-2471", date: "Yesterday — 21 Sep 2026", title: "Earthquake — M4.1 tremor", purok: "Purok 1", type: "Earthquake", status: "Monitoring", updated: "21:30" },
  { id: "EV-2463", date: "Yesterday — 21 Sep 2026", title: "Storm surge — coastal road", purok: "Purok 4", type: "Typhoon", status: "Closed", updated: "16:05" },
  { id: "EV-2458", date: "Yesterday — 21 Sep 2026", title: "Flood — main access road", purok: "Purok 3", type: "Flood", status: "Closed", updated: "11:20" },
];

function ArchiveWorkspace() {
  const [activeCategory, setActiveCategory] = useState("disaster-events");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<(typeof records)[number] | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);

  const active = categories.find(([key]) => key === activeCategory) ?? categories[0];
  const visibleRecords = useMemo(() => records.filter((record) => {
    const matchesQuery = `${record.id} ${record.title} ${record.purok} ${record.type}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All statuses" || record.status === status);
  }), [query, status]);

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b bg-card px-4">
        <Button variant="icon" size="icon" className="size-8 border" aria-label="Toggle archive categories" onClick={() => setSidebarOpen((value) => !value)}><Menu className="size-4" /></Button>
        <div className="flex min-w-0 items-baseline gap-2"><strong className="truncate text-[13px]">RESQPERATION</strong><span className="hidden text-xs text-muted-foreground sm:inline">Archive workspace</span></div>
        <span className="hidden items-center gap-1.5 rounded-sm bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary md:inline-flex"><span className="size-1.5 rounded-full bg-primary" />3 active events</span>
        <div className="ml-auto flex items-center gap-2">
          <label className="hidden h-8 items-center border bg-background px-2 focus-within:ring-2 focus-within:ring-ring/30 sm:flex"><Search className="size-3.5 text-muted-foreground" /><input className="w-36 bg-transparent px-2 text-xs outline-none lg:w-48" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records…" /></label>
          <Button variant="secondary" size="sm" onClick={() => setSavedOpen(true)}><Archive className="size-3.5" /><span className="hidden sm:inline">Saved groups</span></Button>
          <Button size="sm"><Download className="size-3.5" /><span className="hidden sm:inline">Export list</span></Button>
        </div>
      </header>

      <div className="flex items-start">
        <aside className={`${sidebarOpen ? "w-52" : "w-14"} sticky top-12 h-[calc(100vh-3rem)] shrink-0 overflow-hidden border-r bg-card py-4 transition-[width] duration-150`}>
          <p className={`${sidebarOpen ? "px-5" : "sr-only"} mb-2 text-[10px] font-semibold uppercase text-muted-foreground`}>Archive categories</p>
          <nav className="space-y-0.5 px-2" aria-label="Archive categories">
            {categories.map(([key, label, count]) => (
              <button key={key} onClick={() => { setActiveCategory(key); setSelected([]); }} className={`flex h-8 w-full items-center gap-2 rounded-sm px-2.5 text-left text-xs font-medium transition-colors ${activeCategory === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`} title={label}>
                <Archive className="size-3.5 shrink-0" /><span className={sidebarOpen ? "truncate" : "sr-only"}>{label}</span>{sidebarOpen && <span className="ml-auto text-[11px] tabular-nums opacity-75">{count}</span>}
              </button>
            ))}
          </nav>
          {sidebarOpen && <div className="mx-3 mt-6 border-t pt-4"><p className="mb-2 px-2 text-[10px] font-semibold uppercase text-muted-foreground">Saved groups</p><button onClick={() => setSavedOpen(true)} className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent"><span className="size-1.5 rounded-full bg-primary" />Coastal response logs</button></div>}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-4 lg:px-5">
          <div className="archive-rise flex flex-wrap items-center gap-3">
            <h1 className="text-[15px] font-semibold">{active[1]}</h1><span className="text-xs text-muted-foreground">{active[2]} records</span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select aria-label="Purok" className="h-8 rounded-sm border bg-card px-2 text-xs outline-none focus:ring-2 focus:ring-ring/30"><option>All puroks</option><option>Purok 1</option><option>Purok 2</option><option>Purok 5</option></select>
              <select aria-label="Event" className="h-8 rounded-sm border bg-card px-2 text-xs outline-none focus:ring-2 focus:ring-ring/30"><option>All events</option><option>Typhoon</option><option>Flood</option><option>Earthquake</option></select>
              <select aria-label="Status" className="h-8 rounded-sm border bg-card px-2 text-xs outline-none focus:ring-2 focus:ring-ring/30" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Active</option><option>Monitoring</option><option>Closed</option></select>
            </div>
          </div>

          {selected.length > 0 && <div className="archive-rise mt-3 flex min-h-9 flex-wrap items-center gap-2 rounded-sm border border-primary/25 bg-primary/10 px-3 py-1.5"><span className="text-xs font-medium text-primary">{selected.length} selected</span><span className="mx-1 h-3 w-px bg-primary/30" /><Button variant="ghost" size="sm"><FolderPlus className="size-3.5" />Save group</Button><Button variant="ghost" size="sm"><Download className="size-3.5" />Download</Button><Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="size-3.5" />Delete forever</Button><Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSelected([])}>Clear</Button></div>}

          <div className="archive-rise mt-3 overflow-x-auto rounded-sm border bg-card [animation-delay:80ms]">
            <div className="flex min-w-[850px] items-center justify-between border-b px-3 py-2"><span className="text-xs font-semibold">{active[1]} records</span><label className="flex items-center gap-2 text-[11px] text-muted-foreground"><input type="checkbox" checked={visibleRecords.length > 0 && visibleRecords.every((record) => selected.includes(record.id))} onChange={(event) => setSelected(event.target.checked ? visibleRecords.map((record) => record.id) : [])} />Select page</label></div>
            <table className="w-full min-w-[850px] border-collapse text-left text-xs">
              <thead><tr className="border-b bg-muted/60 text-[11px] uppercase text-muted-foreground"><th className="w-10 px-3 py-2"><span className="sr-only">Select</span></th><th className="px-3 py-2 font-medium">ID</th><th className="px-3 py-2 font-medium">Event</th><th className="px-3 py-2 font-medium">Purok</th><th className="px-3 py-2 font-medium">Type</th><th className="px-3 py-2 font-medium">Status</th><th className="px-3 py-2 font-medium">Updated</th><th className="px-3 py-2 text-right font-medium">Action</th></tr></thead>
              <tbody>
                {visibleRecords.map((record, index) => <Fragment key={record.id}>{(index === 0 || visibleRecords[index - 1]?.date !== record.date) && <tr className="border-b bg-muted/35"><td colSpan={8} className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">{record.date}</td></tr>}<tr className={`border-b last:border-0 ${selected.includes(record.id) ? "bg-primary/[0.06]" : "hover:bg-muted/30"}`}><td className="px-3 py-2"><button aria-label={`Select ${record.id}`} onClick={() => toggle(record.id)} className={`grid size-4 place-items-center rounded-sm border ${selected.includes(record.id) ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`}>{selected.includes(record.id) && <Check className="size-3" />}</button></td><td className="px-3 py-2 tabular-nums text-muted-foreground">{record.id}</td><td className="px-3 py-2 font-medium">{record.title}</td><td className="px-3 py-2">{record.purok}</td><td className="px-3 py-2">{record.type}</td><td className="px-3 py-2"><span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-medium ${record.status === "Active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}><span className={`size-1.5 rounded-full ${record.status === "Active" ? "bg-primary" : "bg-muted-foreground/50"}`} />{record.status}</span></td><td className="px-3 py-2 tabular-nums text-muted-foreground">{record.updated}</td><td className="px-3 py-2 text-right"><Button variant="ghost" size="sm" onClick={() => setDetail(record)}><Eye className="size-3.5" />View</Button></td></tr></Fragment>)}
                {visibleRecords.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No archive records match the current filters.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>Showing 1–{visibleRecords.length} of {active[2]} records</span><div className="flex items-center gap-1"><Button variant="secondary" size="sm"><ChevronLeft className="size-3.5" />Prev</Button><Button size="sm">1</Button><Button variant="secondary" size="sm">2</Button><Button variant="secondary" size="sm">3</Button><Button variant="secondary" size="sm">Next<ChevronRight className="size-3.5" /></Button></div></div>
        </main>
      </div>

      {(detail || savedOpen) && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/35 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setDetail(null); setSavedOpen(false); } }}><section role="dialog" aria-modal="true" className="flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden rounded-sm border bg-card shadow-2xl"><header className="flex items-start justify-between border-b px-5 py-4"><div><p className="text-[10px] font-semibold uppercase text-muted-foreground">{detail ? active[1] : "Saved groups"}</p><h2 className="mt-1 text-base font-semibold">{detail ? detail.title : "Saved archive groups"}</h2></div><Button variant="icon" size="icon" aria-label="Close" onClick={() => { setDetail(null); setSavedOpen(false); }}><X className="size-4" /></Button></header><div className="overflow-y-auto p-5">{detail ? <dl className="grid grid-cols-1 border sm:grid-cols-2">{Object.entries(detail).filter(([key]) => key !== "date").map(([key, value]) => <div className="border-b p-3 odd:sm:border-r" key={key}><dt className="text-[10px] font-semibold uppercase text-muted-foreground">{key}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl> : <div className="border p-4"><strong className="text-sm">Coastal response logs</strong><p className="mt-1 text-xs text-muted-foreground">3 saved records · 22 Sep 2026</p></div>}</div><footer className="flex justify-end gap-2 border-t bg-muted/40 px-5 py-3">{detail && <><Button variant="secondary" size="sm"><Download className="size-3.5" />PDF</Button><Button variant="secondary" size="sm"><Download className="size-3.5" />Excel</Button></>}<Button size="sm" onClick={() => { setDetail(null); setSavedOpen(false); }}>Done</Button></footer></section></div>}
    </div>
  );
}
