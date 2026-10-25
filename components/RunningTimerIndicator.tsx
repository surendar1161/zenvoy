"use client";

import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export default function RunningTimerIndicator() {
  const [timerStart, setTimerStart] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("time_entries")
      .select("timer_started_at, description")
      .eq("is_running", true)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.timer_started_at) {
          setTimerStart(data.timer_started_at);
          setDescription(data.description ?? "");
        }
      });
  }, []);

  useEffect(() => {
    if (!timerStart) { setElapsed(0); return; }
    const update = () => setElapsed(Date.now() - new Date(timerStart).getTime());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timerStart]);

  if (!timerStart) return null;

  return (
    <Tooltip title={description || "Timer running"}>
      <Link href="/time-tracking" className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 transition hover:bg-emerald-100" aria-label="Timer running">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-emerald-400" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <ClockCircleOutlined className="text-[12px]" />
        <span className="text-[12.5px] font-bold tabular-nums">{formatElapsed(elapsed)}</span>
      </Link>
    </Tooltip>
  );
}
