import { MapPin } from 'lucide-react';
import { ImageFrame } from '@/components/ui/ImageFrame';
import type { Project } from '@/data/projects';
import styles from './ProjectCard.module.css';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <ImageFrame
        hint={project.imageHint}
        ratio="4/3"
        className={styles.media}
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
      />
      <div className={styles.body}>
        <div className={styles.tags}>
          <span className={styles.tag}>{project.service}</span>
          <span className={styles.sector}>{project.sector}</span>
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.location}>
          <MapPin size={14} strokeWidth={1.75} aria-hidden />
          {project.location}
        </p>
        <p className={styles.scope}>{project.scope}</p>
        <p className={styles.description}>{project.description}</p>
      </div>
    </article>
  );
}
