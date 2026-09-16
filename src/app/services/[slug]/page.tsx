import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { ServiceList } from '@/components/services/ServiceList';
import { ServiceSection } from '@/components/services/ServiceSection';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getService, services, servicePages } from '@/data/services';
import { serviceEnquiry } from '@/lib/whatsapp';
import styles from './page.module.css';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service || !service.hasPage) {
    return { title: 'Service not found' };
  }

  const title = service.metaTitle ?? service.title;
  const description = service.metaDescription ?? service.summary;

  return {
    title: service.title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title, description, url: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service || !service.hasPage) {
    notFound();
  }

  const related = services.filter((item) => item.slug !== service.slug && item.featured).slice(0, 3);

  return (
    <>
      <PageHero
        label={`${service.number} / ${service.category}`}
        title={service.title}
        lede={service.summary}
        breadcrumbs={[
          { href: '/', label: 'Home' },
          { href: '/services', label: 'Services' },
          { label: service.category },
        ]}
      />

      <div className={styles.detail}>
        <Container>
          <ServiceSection service={service} showHeading={false} />
        </Container>
      </div>

      <section className={styles.related} aria-labelledby="related-heading">
        <Container>
          <SectionHeading
            id="related-heading"
            label="Related services"
            title="Other work we carry out"
          />
          <ServiceList services={related} />
        </Container>
      </section>

      <CTASection
        title={`Need ${service.category.toLowerCase()} work quoted?`}
        body="Book a free site inspection and we will specify the system and issue a written quotation."
        enquiryHref={serviceEnquiry(service.enquiryTopic)}
      />
    </>
  );
}
