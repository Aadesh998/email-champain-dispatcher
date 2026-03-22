import React, { useState } from "react";
import {
  Layers,
  FileText,
  Send,
  Archive,
  ChevronDown,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { View } from "../../types";

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onNavigate,
}) => {
  const [draftsOpen, setDraftsOpen] = useState(false);

  const isDraftActive = activeView.startsWith("draft-");

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#191B22",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#10B981",
            padding: "0.5rem",
            borderRadius: "12px",
          }}
        >
          <Layers size={24} color="white" />
        </div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          }}
        >
          MailForge
        </h2>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <SidebarItem
          icon={<FileText size={20} />}
          label="Templates"
          active={activeView === "templates"}
          onClick={() => {
            setActiveView("templates");
            onNavigate?.();
          }}
        />
        <SidebarItem
          icon={<Send size={20} />}
          label="Campaigns"
          active={activeView === "campaigns"}
          onClick={() => {
            setActiveView("campaigns");
            onNavigate?.();
          }}
        />
        <SidebarItem
          icon={<HelpCircle size={20} />}
          label="Help"
          active={activeView === "help"}
          onClick={() => {
            setActiveView("help");
            onNavigate?.();
          }}
        />

        {/* Drafts Dropdown */}
        <div>
          <SidebarItem
            icon={<Archive size={20} />}
            label="Drafts"
            active={isDraftActive}
            onClick={() => setDraftsOpen(!draftsOpen)}
            suffix={
              draftsOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )
            }
          />

          {draftsOpen && (
            <div
              style={{
                marginLeft: "1.5rem",
                marginTop: "0.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <SidebarSubItem
                label="Template-Draft"
                active={activeView === "draft-templates"}
                onClick={() => {
                  setActiveView("draft-templates");
                  onNavigate?.();
                }}
              />
              <SidebarSubItem
                label="Campaign-Draft"
                active={activeView === "draft-campaigns"}
                onClick={() => {
                  setActiveView("draft-campaigns");
                  onNavigate?.();
                }}
              />
            </div>
          )}
        </div>
      </nav>

      <div
        style={{
          marginTop: "auto",
          padding: "1rem",
          color: "#BBCABF",
          fontSize: "0.8rem",
        }}
      >
        <label
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "0.5rem",
            display: "block",
          }}
        >
          System
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div className="pulse-dot" />
          <span>Mail Forge Active</span>
        </div>
      </div>
    </aside>
  );
};

function SidebarItem({
  icon,
  label,
  active,
  onClick,
  suffix,
}: {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
  suffix?: any;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        cursor: "pointer",
        borderRadius: "12px",
        color: active ? "#4EDE93" : "#BBCABF",
        backgroundColor: active ? "rgba(78, 222, 147, 0.05)" : "transparent",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      {active && (
        <div
          style={{
            position: "absolute",
            left: "-1rem",
            width: "4px",
            height: "20px",
            backgroundColor: "#4EDE93",
            borderRadius: "0 4px 4px 0",
          }}
        />
      )}
      {icon}
      <span style={{ fontWeight: active ? "600" : "400", flex: 1 }}>
        {label}
      </span>
      {suffix}
    </div>
  );
}

function SidebarSubItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "0.5rem 1rem",
        cursor: "pointer",
        borderRadius: "8px",
        color: active ? "#4EDE93" : "#BBCABF",
        backgroundColor: active ? "rgba(78, 222, 147, 0.05)" : "transparent",
        fontSize: "0.9rem",
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ fontWeight: active ? "600" : "400" }}>{label}</span>
    </div>
  );
}

interface HeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header
      style={{
        padding: "2rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(17, 19, 25, 0.7)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: "800" }}>{title}</h1>
        <p style={{ color: "#BBCABF", marginTop: "0.25rem" }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>{actions}</div>
    </header>
  );
};
