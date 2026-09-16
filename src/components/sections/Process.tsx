import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { processSteps } from '@/data/site';
import styles from './Process.module.css';

/** How a job runs, in four steps. Numbers and rules only — no icons. */
export function Process() {
  return (
    <section className="section" aria-labelledby="process-heading">
      <Container>
        <SectionHeading
          id="process-heading"
          label="How we work"
          title="From first visit to handover"
        />

        <ol className={styles.grid}>
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.step} className={styles.step} delay={index * 70}>
              <p className={styles.number}>{step.step}</p>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
