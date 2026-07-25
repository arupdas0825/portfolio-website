import React, { useRef } from "react";
import { Github, Linkedin, Facebook, Instagram } from "lucide-react";

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
};

const DEFAULT_LINKS = [
  { name: "GitHub", href: "https://github.com/arupdas0825", icon: "github", color: "#c9d1d9" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/arup-das-381bb02a1/", icon: "linkedin", color: "#0a66c2" },
  { name: "Facebook", href: "https://www.facebook.com/arupofficial08", icon: "facebook", color: "#1877f2" },
  { name: "Instagram", href: "https://www.instagram.com/_arup_official_08/", icon: "instagram", color: "#e1306c" },
];

const SocialButton = ({ link }) => {
  const btnRef = useRef(null);
  const iconRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    const icon = iconRef.current;
    if (!btn || !icon) return;

    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    // Magnetic pull: icon shifts slightly toward the cursor
    const strength = 0.35;
    icon.style.transform = `translate(${relX * strength}px, ${relY * strength}px) scale(1.15)`;

    // Button itself tilts a little for a subtle 3D feel
    const rotateX = (-relY / rect.height) * 10;
    const rotateY = (relX / rect.width) * 10;
    btn.style.transform = `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    const icon = iconRef.current;
    if (!btn || !icon) return;
    icon.style.transform = "translate(0px, 0px) scale(1)";
    btn.style.transform = "perspective(400px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const Icon = ICON_MAP[link.icon];

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.name}
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md transition-shadow duration-300 ease-out social-magnetic-btn"
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.25s ease-out, box-shadow 0.25s ease-out, background-color 0.25s ease-out",
        boxShadow: `0 0 0px 0px ${link.color}00`,
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        textDecoration: "none"
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = `0 0 24px 2px ${link.color}55`;
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 24px 2px ${link.color}55`;
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0px 0px ${link.color}00`;
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
      }}
      onMouseLeave={(e) => {
        handleMouseLeave();
        e.currentTarget.style.boxShadow = `0 0 0px 0px ${link.color}00`;
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
      }}
    >
      <span
        ref={iconRef}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 ease-out"
        style={{
          backgroundColor: `${link.color}22`,
          color: link.color,
          flexShrink: 0
        }}
      >
        {Icon && <Icon size={18} strokeWidth={2.2} />}
      </span>
      <span className="font-medium text-white/90" style={{ color: "#ffffff", fontWeight: 600 }}>{link.name}</span>
    </a>
  );
};

const SocialLinks = ({ links = DEFAULT_LINKS }) => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-start gap-4 py-4 social-links-wrapper">
      {links.map((link) => (
        <SocialButton key={link.name} link={link} />
      ))}
    </div>
  );
};

export { SocialLinks };
export default SocialLinks;
