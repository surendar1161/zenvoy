"use client";

import { useEffect, useState } from "react";
import { Badge, Tooltip, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const { Text } = Typography;

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
      <Link href="/time-tracking" style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 8, padding: "4px 10px", cursor: "pointer",
        }}>
          <Badge status="processing" color="#10b981" />
          <ClockCircleOutlined style={{ color: "#10b981", fontSize: 13 }} />
          <Text strong style={{ fontSize: 12, color: "#10b981", fontVariantNumeric: "tabular-nums" }}>
            {formatElapsed(elapsed)}
          </Text>
        </div>
      </Link>
    </Tooltip>
  );
}
