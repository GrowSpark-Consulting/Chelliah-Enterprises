'use client';

import { useId, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { enquiryServices } from '@/data/site';
import { enquiryWhatsAppLink, submitEnquiry, type Enquiry } from '@/lib/enquiry';
import styles from './ContactForm.module.css';

type ContactFormProps = {
  /** Which page this instance sits on; recorded against the enquiry. */
  source?: string;
};

type FieldName = keyof Enquiry;
type Errors = Partial<Record<FieldName, string>>;

/** Visual order of the fields, used to pick which one to focus on error. */
const fieldOrder: FieldName[] = [
  'name',
  'phone',
  'email',
  'company',
  'service',
  'location',
  'message',
];

const emptyEnquiry: Enquiry = {
  name: '',
  phone: '',
  email: '',
  company: '',
  service: enquiryServices[0],
  location: '',
  message: '',
};

function validate(values: Enquiry): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  const digits = values.phone.replace(/\D/g, '');
  if (!values.phone.trim()) {
    errors.phone = 'Please enter a phone number we can reach you on.';
  } else if (digits.length < 10) {
    errors.phone = 'Please enter a valid phone number with at least 10 digits.';
  }

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please check this email address.';
  }

  if (!values.service) {
    errors.service = 'Please choose the service you need.';
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="fieldError" id={id}>
      <AlertCircle size={14} strokeWidth={2} aria-hidden />
      {message}
    </p>
  );
}

export function ContactForm({ source = 'Website' }: ContactFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  /** Guards against a double submit racing past the disabled button. */
  const inFlight = useRef(false);
  /**
   * Identifies this attempt end to end. Kept until an attempt succeeds, so a
   * retry after a failure reuses it and the sheet can reject the duplicate.
   */
  const submissionId = useRef('');
  const honeypot = useRef('');
  const [values, setValues] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [sentEnquiry, setSentEnquiry] = useState<Enquiry | null>(null);

  const update = (field: FieldName) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // A second submit while one is already running would create a duplicate.
    if (inFlight.current) return;

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Focus by field id rather than by [aria-invalid], which React has not
      // written to the DOM yet at this point in the same tick.
      const firstInvalid = fieldOrder.find((field) => found[field]);
      if (firstInvalid) {
        formRef.current
          ?.querySelector<HTMLElement>(`#${CSS.escape(`${id}-${firstInvalid}`)}`)
          ?.focus();
      }
      setStatus('idle');
      return;
    }

    if (!submissionId.current) {
      submissionId.current = crypto.randomUUID();
    }

    inFlight.current = true;
    setStatus('sending');

    const submitted = values;
    const result = await submitEnquiry(submitted, {
      source,
      submissionId: submissionId.current,
      website: honeypot.current,
    });

    inFlight.current = false;

    if (result.ok) {
      setStatus('sent');
      setStatusMessage(
        'Your enquiry has been recorded and sent to our team. We will respond — usually within a few hours.',
      );
      setSentEnquiry(submitted);
      setValues(emptyEnquiry);
      // The next enquiry from this form is a new one.
      submissionId.current = '';
    } else {
      setStatus('failed');
      setStatusMessage(result.error);
    }
  };

  const fieldProps = (field: FieldName) => ({
    id: `${id}-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    className: 'input',
    'aria-invalid': errors[field] ? ('true' as const) : undefined,
    'aria-describedby': errors[field] ? `${id}-${field}-error` : undefined,
  });

  const errorFor = (field: FieldName) => ({
    id: `${id}-${field}-error`,
    message: errors[field],
  });

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.eyebrow}>Free site inspection</p>
      <h2 className={styles.heading}>Send your project details</h2>
      <p className={styles.intro}>
        Tell us what the site needs. We will come and measure, then quote in writing.
      </p>

      <div className={styles.fields}>
        <div className="field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input type="text" autoComplete="name" required {...fieldProps('name')} />
          <FieldError {...errorFor('name')} />
        </div>

        <div className="field">
          <label htmlFor={`${id}-phone`}>Phone</label>
          <input type="tel" autoComplete="tel" required {...fieldProps('phone')} />
          <FieldError {...errorFor('phone')} />
        </div>

        <div className="field">
          <label htmlFor={`${id}-email`}>
            Email <span className="optional">(optional)</span>
          </label>
          <input type="email" autoComplete="email" {...fieldProps('email')} />
          <FieldError {...errorFor('email')} />
        </div>

        <div className="field">
          <label htmlFor={`${id}-company`}>
            Company <span className="optional">(optional)</span>
          </label>
          <input type="text" autoComplete="organization" {...fieldProps('company')} />
        </div>

        <div className="field">
          <label htmlFor={`${id}-service`}>Service required</label>
          <select required {...fieldProps('service')}>
            {enquiryServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <FieldError {...errorFor('service')} />
        </div>

        <div className="field">
          <label htmlFor={`${id}-location`}>
            Project location <span className="optional">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Oragadam, Chennai"
            {...fieldProps('location')}
          />
        </div>

        <div className={`field ${styles.full}`}>
          <label htmlFor={`${id}-message`}>
            Message <span className="optional">(optional)</span>
          </label>
          <textarea
            rows={4}
            placeholder="The site, the problem, approximate area and your timeline."
            {...fieldProps('message')}
          />
        </div>
      </div>

      {/* Honeypot: off-screen and skipped by keyboard and assistive tech, so
          only an automated submitter will ever fill it in. */}
      <div className={styles.honeypot} aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input
          type="text"
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          onChange={(event) => {
            honeypot.current = event.target.value;
          }}
        />
      </div>

      <div className={styles.submit}>
        <Button type="submit" variant="accent" block disabled={status === 'sending'}>
          <WhatsAppIcon size={17} />
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>

      <p className={styles.footnote}>
        Your details go straight to our team. No marketing lists, no spam.
      </p>

      <div aria-live="polite">
        {status === 'sent' && (
          <div className={`${styles.status} ${styles.statusSuccess}`}>
            <CheckCircle2 size={18} strokeWidth={2} aria-hidden />
            <span>
              <strong className={styles.statusTitle}>Enquiry received</strong>
              {statusMessage}
              {sentEnquiry && (
                <a
                  className={styles.statusAction}
                  href={enquiryWhatsAppLink(sentEnquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon size={15} />
                  Also send it on WhatsApp
                </a>
              )}
            </span>
          </div>
        )}
        {status === 'failed' && (
          <p className={`${styles.status} ${styles.statusError}`}>
            <AlertCircle size={18} strokeWidth={2} aria-hidden />
            <span>
              <strong className={styles.statusTitle}>Your enquiry was not sent</strong>
              {statusMessage}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}

