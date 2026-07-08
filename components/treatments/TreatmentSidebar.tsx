import type { TreatmentData } from "@/lib/treatments";
import styles from "@/styles/TreatmentPage.module.css";

type TreatmentSidebarProps = {
  activeSection: string;
  sidebar: TreatmentData["sidebar"];
};

export function TreatmentSidebar({ activeSection, sidebar }: TreatmentSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Treatment page sections">
      <nav className={styles.sidebarNav}>
        {sidebar.items.map((item) => (
          <a
            className={
              activeSection === item.href.replace("#", "")
                ? styles.activeNavItem
                : undefined
            }
            href={item.href}
            key={item.href}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className={styles.sidebarCta}>
        <strong>{sidebar.ctaTitle}</strong>
        <p>{sidebar.ctaText}</p>
        <a href="#contact">Book appointment</a>
      </div>
    </aside>
  );
}
