'use client';

import React, { useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Calendar,
    CheckCircle2,
    Cloud,
    Database,
    DollarSign,
    FileText,
    Globe,
    Menu,
    Printer,
    Shield,
    Sparkles,
    Users,
    X,
    Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


type Feature = {
    icon: React.ReactNode;
    title: string;
    description: string;
    accent: string;
    iconBg: string;
};

type Workflow = {
    step: string;
    title: string;
    description: string;
};

const NAV_ITEMS = [
    // { label: 'Features', href: '#features' },
    // { label: 'Workflow', href: '#workflow' },
    // { label: 'Benefits', href: '#benefits' },
    { label: 'Contact', href: '/contact' },
];

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.55, ease: 'easeOut' },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
            },
        },
    };

    const features: Feature[] = [
        {
            icon: <Users className="h-7 w-7" />,
            title: 'Patient Management',
            description:
                'Create and retrieve patient profiles in seconds with repeat-visit lookup by phone number.',
            accent: 'from-[#17479E] to-[#0B738B]',
            iconBg: 'bg-[#DBEAFE]',
        },
        {
            icon: <Calendar className="h-7 w-7" />,
            title: 'Visit Tracking',
            description:
                'Capture diagnosis, prescriptions, services, and fees in one guided, validated visit form.',
            accent: 'from-[#0B738B] to-[#2C8D74]',
            iconBg: 'bg-[#D1FAE5]',
        },
        {
            icon: <FileText className="h-7 w-7" />,
            title: 'Custom Templates',
            description:
                'Build branded receipt templates and convert them to polished PDFs without manual formatting.',
            accent: 'from-[#A94C00] to-[#E05A29]',
            iconBg: 'bg-[#FFEDD5]',
        },
        {
            icon: <BarChart3 className="h-7 w-7" />,
            title: 'Business Analytics',
            description:
                'See live revenue, trends, and operational insights to improve decisions across your clinic.',
            accent: 'from-[#1D4ED8] to-[#0EA5A5]',
            iconBg: 'bg-[#E0F2FE]',
        },
        {
            icon: <DollarSign className="h-7 w-7" />,
            title: 'Financial Management',
            description:
                'Track payment status, produce receipts, and export billing data for accounting workflows.',
            accent: 'from-[#14532D] to-[#15803D]',
            iconBg: 'bg-[#DCFCE7]',
        },
        {
            icon: <Shield className="h-7 w-7" />,
            title: 'Multi-Tenant Security',
            description:
                'Protect every clinic with strict tenant isolation, role-based access, and secure authentication.',
            accent: 'from-[#1E3A8A] to-[#334155]',
            iconBg: 'bg-[#E2E8F0]',
        },
    ];

    const benefits = [
        { icon: <Zap className="h-5 w-5" />, text: 'Reduce paperwork by 80%' },
        { icon: <Cloud className="h-5 w-5" />, text: 'Cloud backup and secure access' },
        { icon: <Database className="h-5 w-5" />, text: 'Centralized patient records' },
        { icon: <Globe className="h-5 w-5" />, text: 'Works on desktop, tablet, and mobile' },
        { icon: <Printer className="h-5 w-5" />, text: 'Professional branded receipts' },
        { icon: <CheckCircle2 className="h-5 w-5" />, text: 'Compliance-ready workflows' },
    ];

    const stats = [
        { value: '100%', label: 'Data isolation per clinic' },
        { value: '24/7', label: 'Cloud availability' },
        { value: '3x', label: 'Faster desk operations' },
        { value: '∞', label: 'Patient history retention' },
    ];

    const workflows: Workflow[] = [
        {
            step: '01',
            title: 'Patient Arrival',
            description: 'Find existing records by phone or register a first-time patient in moments.',
        },
        {
            step: '02',
            title: 'Doctor Visit',
            description: 'Capture diagnosis, prescribed medicines, services, and consultation details.',
        },
        {
            step: '03',
            title: 'Billing and Receipt',
            description: 'Issue auto-numbered branded receipts and export printable PDF instantly.',
        },
        {
            step: '04',
            title: 'Analytics and Export',
            description: 'Monitor clinic performance and export reports to support business reviews.',
        },
    ];

    return (
        <div
            className={`relative overflow-x-hidden bg-[#F8FBFF] text-slate-900`}
        >
            <div className="absolute left-22 top-30 h-72 w-72 rounded-full bg-[#57C7D4]/40 blur-3xl" />
            <div className="absolute right-0 top-122 h-80 w-80 rounded-full bg-[#1D4ED8]/55 blur-3xl" />

            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 z-50 w-full border-b border-[#DCE7F7] bg-white/85 backdrop-blur-lg"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/">
                        <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3">
                            <Image src="/logo.png" alt="Clinova" width={44} height={44} className="h-11 w-11" />
                            <div>
                                <p className="font-display text-xl font-extrabold leading-none text-[#183B7A]">
                                    Clinova
                                </p>
                                {/* <p className="font-body text-xs tracking-[0.2em] text-[#0B738B]">CLINIC OS</p> */}
                            </div>
                        </motion.div>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {NAV_ITEMS.map((item) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                className="font-body text-sm font-semibold hover:bg-[#183B7A] text-slate-700  rounded-full px-5 py-2.5 hover:text-white border border-[#183B7A] transition-colors duration-100"
                                whileHover={{ y: -2 }}
                            >
                                {item.label}
                            </motion.a>
                        ))}
                        <Link href="/login">
                            <motion.span
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 hover:bg-white hover:text-[#183B7A] hover:border hover:border-[#183B7A] rounded-full bg-[#183B7A] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-lg shadow-[#183B7A]/20 transition-colors duration-100"
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </motion.span>
                        </Link>
                    </div>

                    <button
                        className="md:hidden"
                        aria-label="Toggle menu"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-t border-[#DCE7F7] bg-white px-6 pb-6 pt-3 md:hidden"
                    >
                        <div className="flex flex-col gap-3">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="font-body text-sm font-semibold text-slate-700 px-8 py-2.5 inline-flex items-center justify-center rounded-full border border-[#183B7A]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <span className="mt-2 inline-flex items-center justify-center w-full rounded-full bg-[#183B7A] px-8 py-2.5 font-body text-sm font-semibold text-white">
                                    Get Started
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </motion.nav>

            <section className="relative px-6 pb-20 pt-32 md:pt-36">
                <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-2xl"
                    >
                        <motion.div
                            variants={fadeInUp}
                            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C6DCF7] bg-white px-4 py-2 text-sm font-semibold text-[#0B738B]"
                        >
                            <Sparkles className="h-4 w-4" />
                            Purpose-built for modern OPD clinics
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="font-display text-4xl font-extrabold leading-tight text-[#0F234A] sm:text-5xl md:text-6xl"
                        >
                            One intelligent workflow for registration, billing, and care delivery.
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-slate-600"
                        >
                            Clinova helps front-desk teams move faster, doctors document visits clearly, and owners track
                            performance without spreadsheets.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/login" className="inline-flex items-center justify-center">
                                <motion.span
                                    whileHover={{ y: -1, boxShadow: '0 14px 30px rgba(24,59,122,0.24)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183B7A] px-7 py-3.5 font-body text-base font-semibold text-white"
                                >
                                    Start Free Trial
                                    <ArrowRight className="h-5 w-5" />
                                </motion.span>
                            </Link>
                            <a
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full border border-[#BCD4F3] bg-white px-7 py-3.5 font-body text-base font-semibold text-[#183B7A] transition-colors hover:bg-[#EFF6FF]"
                            >
                                Contact Us
                            </a>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-3">
                            {['No credit card required', 'Multi-clinic ready', 'Secure cloud backups'].map((pill) => (
                                <span
                                    key={pill}
                                    className="rounded-full bg-[#EAF4FF] px-4 py-2 font-body text-sm font-medium text-[#25589E]"
                                >
                                    {pill}
                                </span>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.6 }}
                        className="relative"
                    >
                        <div className="rounded-3xl border border-[#CBE0F9] bg-white p-6 shadow-2xl shadow-[#93B7E8]/25">
                            <div className="mb-6 flex items-center justify-between">
                                <p className="font-display text-lg font-bold text-[#183B7A]">Live Clinic Snapshot</p>
                                <span className="rounded-full bg-[#DDF6E6] px-3 py-1 font-body text-xs font-semibold text-[#1E824C]">
                                    Online
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-[#F0F7FF] p-4">
                                    <p className="font-body text-xs text-slate-500">Today Patients</p>
                                    <p className="font-display mt-1 text-3xl font-bold text-[#0F234A]">124</p>
                                </div>
                                <div className="rounded-2xl bg-[#ECFAF8] p-4">
                                    <p className="font-body text-xs text-slate-500">Completed Visits</p>
                                    <p className="font-display mt-1 text-3xl font-bold text-[#0C6D65]">97</p>
                                </div>
                                <div className="rounded-2xl bg-[#FFF3E8] p-4">
                                    <p className="font-body text-xs text-slate-500">Parchi Generated</p>
                                    <p className="font-display mt-1 text-3xl font-bold text-[#B45309]">12K+</p>
                                </div>
                                <div className="rounded-2xl bg-[#EEF2FF] p-4">
                                    <p className="font-body text-xs text-slate-500">Daily Revenue</p>
                                    <p className="font-display mt-1 text-3xl font-bold text-[#1E40AF]">$2.6k</p>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl border border-[#DBEAFE] bg-[#FAFCFF] p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="font-body text-sm font-semibold text-[#25589E]">Queue Progress</p>
                                    <p className="font-body text-sm font-semibold text-slate-500">78%</p>
                                </div>
                                <div className="h-2.5 overflow-hidden rounded-full bg-[#D9E8FA]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '78%' }}
                                        transition={{ duration: 1.2, delay: 0.45 }}
                                        className="h-full rounded-full bg-linear-to-r from-[#183B7A] to-[#0B738B]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-6 rounded-3xl border border-[#D9E7F9] bg-white/70 p-7 backdrop-blur-sm md:grid-cols-4"
                >
                    {stats.map((stat) => (
                        <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                            <div className="font-display text-3xl font-extrabold text-[#0F234A] md:text-4xl">
                                {stat.value}
                            </div>
                            <div className="font-body mt-1 text-sm text-slate-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <section id="features" className="px-6 py-32 relative">
                <div className="absolute left-22 top-30 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FCA45B]/35 blur-3xl" />
                <div className="absolute right-0 top-122 h-80 w-80 rounded-full bg-[#57C7D4]/40 blur-3xl" />
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-14 text-center"
                    >
                        <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-[#0B738B]">
                            Product Highlights
                        </p>
                        <h2 className="font-display mt-3 text-3xl font-extrabold text-[#0F234A] md:text-5xl">
                            Built for busy clinics, not generic businesses
                        </h2>
                        <p className="font-body mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                            Clinova removes repetitive desk work so your team can focus on patient experience and care outcomes.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 "
                    >
                        {features.map((feature, index) => (
                            <FeatureCard key={feature.title} feature={feature} index={index} />
                        ))}
                    </motion.div>
                </div>
            </section>

            <section id="workflow" className="bg-[#F1F8FF] px-6 py-32 relative">
                <div className="absolute left-22 top-30 h-72 w-72 rounded-full bg-[#1D4ED8]/55 blur-3xl" />
                <div className="absolute right-0 top-122 h-96 w-96 rounded-full bg-[#FCA45B]/35 blur-3xl" />
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-14 text-center"
                    >
                        <p className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-[#25589E]">
                            Clinic Flow
                        </p>
                        <h2 className="font-display mt-3 text-3xl font-extrabold text-[#0F234A] md:text-5xl">
                            One patient journey, four efficient stages
                        </h2>
                    </motion.div>

                    <div className="grid gap-8 lg:grid-cols-4">
                        {workflows.map((workflow, index) => (
                            <WorkflowCard key={workflow.step} workflow={workflow} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section id="benefits" className="bg-linear-to-br from-[#16356E] via-[#1D4D8A] to-[#0E7A86] px-6 py-32 text-white">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mb-14 text-center"
                    >
                        <h2 className="font-display text-3xl font-extrabold md:text-5xl">
                            Why growing clinics choose Clinova
                        </h2>
                        <p className="font-body mx-auto mt-4 max-w-2xl text-lg text-sky-100">
                            Reliable operations, cleaner records, and faster front-desk experience from day one.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {benefits.map((benefit) => (
                            <motion.div
                                key={benefit.text}
                                variants={fadeInUp}
                                whileHover={{ y: -4 }}
                                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
                            >
                                <div className="rounded-xl bg-white/20 p-2">{benefit.icon}</div>
                                <p className="font-body text-base font-medium">{benefit.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section id="contact" className="px-6 py-32 relative">
                <div className="absolute left-22 top-0 h-72 w-72 rounded-full bg-[#57C7D4]/40 blur-3xl" />
                <div className="absolute right-0 -bottom-16 h-80 w-80 rounded-full bg-[#1D4ED8]/55 blur-3xl" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-5xl rounded-4xl border border-[#C8DCF5] bg-white p-8 text-center shadow-xl shadow-[#98B8E7]/20 md:p-12"
                >
                    <h2 className="font-display text-3xl font-extrabold text-[#0F234A] md:text-5xl">
                        Ready to modernize your clinic experience?
                    </h2>
                    <p className="font-body mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                        Start a free trial and set up your first clinic workflow in minutes.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        <Link href="/login" className="inline-flex cursor-pointer z-40 items-center justify-center">
                            <motion.span
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center justify-center rounded-full bg-[#183B7A] px-8 py-3.5 font-body text-base font-semibold text-white"
                            >
                                Get Started Now
                            </motion.span>
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-full border border-[#B9D3F3] px-8 py-3.5 font-body text-base font-semibold text-[#183B7A] hover:bg-[#F2F8FF] cursor-pointer z-40"
                        >
                            Contact Team
                        </Link>
                    </div>
                </motion.div>
            </section>

            <footer className="bg-[#0B1E40] px-6 py-8 text-white">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
                    <Link href="/">
                        <div className="flex items-center gap-3">
                            <Image src="/logo.png" alt="Clinova" width={40} height={40} />
                            <div>
                                <p className="font-display text-lg font-bold">Clinova</p>
                                <p className="font-body text-sm text-slate-300">Cloud clinic management platform</p>
                            </div>
                        </div>
                    </Link>

                    <div className="text-center md:text-right">
                        <p className="font-body text-sm text-slate-300">Copyright 2026 Clinova</p>
                        <a
                            href="https://pixelpropx.in"
                            target="_blank"
                            rel="noreferrer"
                            className="font-body text-sm text-sky-300 hover:text-sky-200"
                        >
                            Designed and Developed by Pixel PropX
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 34 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-[#D5E6FA] bg-white p-7 shadow-lg shadow-[#C6DAF7]/20 z-10"
        >
            <div className={`mb-5 inline-flex rounded-2xl p-3 text-[#183B7A] ${feature.iconBg}`}>{feature.icon}</div>
            <h3 className="font-display text-2xl font-bold text-[#0F234A]">{feature.title}</h3>
            <p className="font-body mt-3 leading-relaxed text-slate-600">{feature.description}</p>
            <div className={`mt-6 h-1.5 w-full rounded-full bg-linear-to-r ${feature.accent}`} />
        </motion.div>
    );
};

const WorkflowCard = ({ workflow, index }: { workflow: Workflow; index: number }) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-70px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
        >
            <div className="h-full rounded-3xl border border-[#D5E6FA] bg-white p-7 shadow-md shadow-[#CDDEF6]/20">
                <p className="font-display text-5xl font-extrabold leading-none text-[#D5E6FA]">{workflow.step}</p>
                <h3 className="font-display mt-4 text-xl font-bold text-[#0F234A]">{workflow.title}</h3>
                <p className="font-body mt-2 text-slate-600">{workflow.description}</p>
            </div>
            {index < 3 && (
                <ArrowRight className="absolute -right-7 top-1/2 hidden h-7 w-7 -translate-y-1/2 text-[#6EA2DD] lg:block" />
            )}
        </motion.div>
    );
};

export default LandingPage;
