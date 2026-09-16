import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={styles.wrap}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.code}>Error 404</p>
          <h1 className={styles.title}>This page could not be found</h1>
          <p className="lede">
            The page may have moved. Head back to the homepage, or go straight to what we do.
          </p>
          <div className={styles.actions}>
            <Button href="/" variant="primary">
              Back to homepage
            </Button>
            <Button href="/services" variant="secondary">
              View our services
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
