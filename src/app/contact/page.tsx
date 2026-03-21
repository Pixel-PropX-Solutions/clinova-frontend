'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useSubmitContactQuery } from '@/hooks/api/useContact';

type ContactForm = {
    fullName: string;
    phoneNumber: string;
    email: string;
    messageType: string;
    message: string;
    captcha: string;
};

const INITIAL_FORM: ContactForm = {
    fullName: '',
    phoneNumber: '',
    email: '',
    messageType: '',
    message: '',
    captcha: '',
};

const createCaptchaNumbers = () => ({
    left: Math.floor(Math.random() * 9) + 1,
    right: Math.floor(Math.random() * 9) + 1,
});

export default function ContactPage() {
    const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
    const [captchaNumbers, setCaptchaNumbers] = useState(createCaptchaNumbers);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const submitContactQuery = useSubmitContactQuery();

    const captchaTotal = useMemo(
        () => captchaNumbers.left + captchaNumbers.right,
        [captchaNumbers.left, captchaNumbers.right],
    );

    const handleCaptchaReset = () => {
        setCaptchaNumbers(createCaptchaNumbers());
        setForm((prev) => ({ ...prev, captcha: '' }));
        setError('');
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (
            !form.fullName.trim() ||
            !form.phoneNumber.trim() ||
            !form.email.trim() ||
            !form.messageType ||
            !form.message.trim() ||
            !form.captcha.trim()
        ) {
            setError('Please complete all fields before submitting.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please provide a valid email address.');
            return;
        }

        const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;
        if (!phoneRegex.test(form.phoneNumber)) {
            setError('Please provide a valid phone number.');
            return;
        }

        if (Number(form.captcha) !== captchaTotal) {
            setError('Captcha answer is incorrect. Please try again.');
            handleCaptchaReset();
            return;
        }

        try {
            const response = await submitContactQuery.mutateAsync({
                fullName: form.fullName.trim(),
                phoneNumber: form.phoneNumber.trim(),
                email: form.email.trim(),
                messageType: form.messageType,
                message: form.message.trim(),
            });

            setSuccess(response.message || 'Thanks for contacting us. Our team will get back to you soon.');
            setForm(INITIAL_FORM);
            setCaptchaNumbers(createCaptchaNumbers());
        } catch (submitError: any) {
            console.log('Contact form submission error:', submitError);
            setError(
                submitError?.response?.data?.detail ||
                'Unable to submit your message right now. Please try again shortly.',
            );
        }
    };

    return (
        <main className='relative overflow-hidden px-6 py-16 md:py-24'>
            <div className='absolute -left-12 top-10 h-64 w-64 rounded-full bg-[#5CC6C4]/30 blur-3xl' />
            <div className='absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-[#2F5FA5]/25 blur-3xl' />

            <section className='relative mx-auto max-w-5xl rounded-4xl border border-[#C8DCF5] bg-white/95 p-6 shadow-xl shadow-[#98B8E7]/20 backdrop-blur md:p-10'>
                <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <p className='font-body mb-2 inline-flex rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold tracking-wide text-[#1D4D8A]'>
                            CONTACT US
                        </p>
                        <h1 className='font-display text-3xl font-extrabold text-[#0F234A] md:text-4xl'>
                            Let&apos;s talk about your clinic needs
                        </h1>
                        <p className='font-body mt-3 max-w-2xl text-slate-600'>
                            Send your message and our team will get back to you with the right setup, pricing, or support
                            guidance.
                        </p>
                    </div>
                    <Link
                        href='/'
                        className='inline-flex items-center justify-center rounded-full border border-[#BCD4F3] px-5 py-2.5 font-body text-sm font-semibold text-[#183B7A] hover:bg-[#F2F8FF] cursor-pointer whitespace-nowrap'
                    >
                        Back to Home
                    </Link>
                    <Link
                        href='/login'
                        className='inline-flex items-center justify-center rounded-full bg-[#183B7A] px-7 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-[#183B7A]/20 transition hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#183B7A]/50 disabled:shadow-none'
                    >
                        Login
                    </Link>
                </div>

                <div className='mb-8 grid gap-4 sm:grid-cols-2'>
                    <article className='rounded-2xl border border-[#D6E5F8] bg-[#F8FBFF] p-4'>
                        <h2 className='font-body text-sm font-bold uppercase tracking-wide text-[#1D4D8A]'>Email Us</h2>
                        <p className='font-body mt-2 text-sm text-slate-700'>pixelpropxsolutions@gmail.com</p>
                    </article>

                    <article className='rounded-2xl border border-[#D6E5F8] bg-[#F8FBFF] p-4'>
                        <h2 className='font-body text-sm font-bold uppercase tracking-wide text-[#1D4D8A]'>Call Us</h2>
                        <p className='font-body mt-2 text-sm text-slate-700'>+91-6367097548</p>
                    </article>

                    <article className='rounded-2xl border border-[#D6E5F8] bg-[#F8FBFF] p-4'>
                        <h2 className='font-body text-sm font-bold uppercase tracking-wide text-[#1D4D8A]'>Business Hours</h2>
                        <p className='font-body mt-2 text-sm text-slate-700'>Mon - Fri: 9AM - 6PM IST</p>
                    </article>

                    <article className='rounded-2xl border border-[#D6E5F8] bg-[#F8FBFF] p-4'>
                        <h2 className='font-body text-sm font-bold uppercase tracking-wide text-[#1D4D8A]'>Quick Response Guarantee</h2>
                        <p className='font-body mt-2 text-sm text-slate-700'>
                            We respond to all inquiries within 24 hours. For urgent matters, please call us directly.
                        </p>
                    </article>
                </div>

                <form onSubmit={handleSubmit} className='grid gap-5 md:grid-cols-2'>
                    <label className='font-body flex flex-col gap-2 text-sm font-semibold text-slate-700'>
                        Full Name
                        <input
                            value={form.fullName}
                            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                            type='text'
                            placeholder='Enter your full name'
                            className='rounded-xl border border-[#CFE0F5] bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-[#2F5FA5] focus:ring-2 focus:ring-[#2F5FA5]/20'
                        />
                    </label>

                    <label className='font-body flex flex-col gap-2 text-sm font-semibold text-slate-700'>
                        Phone Number
                        <input
                            value={form.phoneNumber}
                            onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                            type='tel'
                            placeholder='e.g. +8801XXXXXXXXX'
                            className='rounded-xl border border-[#CFE0F5] bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-[#2F5FA5] focus:ring-2 focus:ring-[#2F5FA5]/20'
                        />
                    </label>

                    <label className='font-body flex flex-col gap-2 text-sm font-semibold text-slate-700'>
                        Email
                        <input
                            value={form.email}
                            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                            type='email'
                            placeholder='you@clinic.com'
                            className='rounded-xl border border-[#CFE0F5] bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-[#2F5FA5] focus:ring-2 focus:ring-[#2F5FA5]/20'
                        />
                    </label>

                    <label className='font-body flex flex-col gap-2 text-sm font-semibold text-slate-700'>
                        Message Type
                        <select
                            value={form.messageType}
                            onChange={(event) => setForm((prev) => ({ ...prev, messageType: event.target.value }))}
                            className='rounded-xl border border-[#CFE0F5] bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-[#2F5FA5] focus:ring-2 focus:ring-[#2F5FA5]/20'
                        >
                            <option value=''>Select a type</option>
                            <option value='general'>General Inquiry</option>
                            <option value='demo'>Demo Request</option>
                            <option value='support'>Technical Support</option>
                            <option value='billing'>Billing</option>
                            <option value='feedback'>Feedback</option>
                        </select>
                    </label>

                    <label className='font-body md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-700'>
                        Message
                        <textarea
                            value={form.message}
                            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                            rows={5}
                            placeholder='Tell us how we can help'
                            className='resize-y rounded-xl border border-[#CFE0F5] bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-[#2F5FA5] focus:ring-2 focus:ring-[#2F5FA5]/20'
                        />
                    </label>

                    <div className='md:col-span-2 grid gap-3 rounded-2xl border border-[#D6E5F8] bg-[#F7FBFF] p-4 md:grid-cols-[1fr_auto] md:items-end'>
                        <label className='font-body flex flex-col gap-2 text-sm font-semibold text-slate-700'>
                            Captcha: What is {captchaNumbers.left} + {captchaNumbers.right}?
                            <input
                                value={form.captcha}
                                onChange={(event) => setForm((prev) => ({ ...prev, captcha: event.target.value }))}
                                type='text'
                                inputMode='numeric'
                                placeholder='Enter answer'
                                className='rounded-xl border border-[#CFE0F5] bg-white px-4 py-3 font-normal text-slate-800 outline-none transition focus:border-[#2F5FA5] focus:ring-2 focus:ring-[#2F5FA5]/20'
                            />
                        </label>

                        <button
                            type='button'
                            onClick={handleCaptchaReset}
                            className='h-11 rounded-xl border border-[#BDD3F2] px-4 font-body text-sm font-semibold text-[#1D4D8A] transition hover:bg-[#EAF3FF] cursor-pointer'
                        >
                            Refresh Captcha
                        </button>
                    </div>

                    {(error || success) && (
                        <div
                            className={`md:col-span-2 rounded-xl px-4 py-3 font-body text-sm font-semibold ${error
                                ? 'border border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                                : 'border border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]'
                                }`}
                        >
                            {error || success}
                        </div>
                    )}

                    <div className='md:col-span-2 flex justify-end'>
                        <button
                            type='submit'
                            disabled={submitContactQuery.isPending}
                            className='inline-flex items-center justify-center rounded-full bg-[#183B7A] px-7 py-3 font-body text-sm font-semibold text-white shadow-lg shadow-[#183B7A]/20 transition hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed disabled:bg-[#183B7A]/50 disabled:shadow-none'
                        >
                            {submitContactQuery.isPending ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}