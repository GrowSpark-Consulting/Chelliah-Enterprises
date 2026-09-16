'use client';

import { useMemo, useState } from 'react';
import { projectCategories, projects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectGrid.module.css';

type FilterId = (typeof projectCategories)[number]['id'];

export function ProjectGrid() {
  const [active, setActive] = useState<FilterId>('all');

  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([['all', projects.length]]);
    for (const project of projects) {
      map.set(project.category, (map.get(project.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const visible = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter projects by service">
        {projectCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={styles.filter}
            aria-pressed={active === category.id}
            onClick={() => setActive(category.id)}
          >
            {category.label}
            <span className={styles.count}>{counts.get(category.id) ?? 0}</span>
          </button>
        ))}
      </div>

      <ul className={styles.grid} aria-live="polite">
        {visible.map((project) => (
          <li key={project.id} className={styles.item}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className={styles.empty}>No projects recorded under this service yet.</p>
      )}
    </>
  );
}
