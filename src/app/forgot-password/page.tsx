import Link from 'next/link';

export default function ForgotPasswordPage() {
    return (
        <main className='relative overflow-hidden px-6 py-16 md:py-24'>
            <div className='absolute -left-12 top-10 h-64 w-64 rounded-full bg-[#5CC6C4]/30 blur-3xl' />
            <div className='absolute -right-12 bottom-0 h-72 w-72 rounded-full bg-[#2F5FA5]/25 blur-3xl' />

            <section className='relative mx-auto max-w-4xl rounded-4xl border border-[#C8DCF5] bg-white/95 p-6 shadow-xl shadow-[#98B8E7]/20 backdrop-blur md:p-10'>
                <div className='mb-8'>
                    <p className='font-body mb-2 inline-flex rounded-full bg-[#EAF4FF] px-3 py-1 text-xs font-semibold tracking-wide text-[#1D4D8A]'>
                        ACCOUNT HELP
                    </p>
                    <h1 className='font-display text-3xl font-extrabold text-[#0F234A] md:text-4xl'>
                        Forgot your password?
                    </h1>
                    <p className='font-body mt-3 max-w-3xl text-slate-600'>
                        If you cannot sign in to Clinova, submit a password reset request through one of the approved
                        channels below. For security reasons, password reset requests are reviewed manually.
                    </p>
                </div>

                <div className='grid gap-5 md:grid-cols-2'>
                    <article className='rounded-2xl border border-[#D6E5F8] bg-[#F7FBFF] p-5'>
                        <h2 className='font-display text-xl font-bold text-[#12376F]'>
                            Option 1: Submit a Contact Form Request
                        </h2>
                        <p className='font-body mt-2 text-sm leading-6 text-slate-600'>
                            Submit the Clinova contact form with the same password reset request, including your
                            registered email, clinic name, and contact number.
                        </p>
                        <Link
                            href='/contact'
                            className='mt-4 inline-flex items-center justify-center rounded-full bg-[#183B7A] px-5 py-2.5 font-body text-sm font-semibold text-white shadow-lg shadow-[#183B7A]/20 transition hover:-translate-y-0.5'
                        >
                            Go to Contact Form
                        </Link>
                    </article>

                    <article className='rounded-2xl border border-[#D6E5F8] bg-[#F7FBFF] p-5'>
                        <h2 className='font-display text-xl font-bold text-[#12376F]'>
                            Option 2: Contact the Administrator
                        </h2>
                        <p className='font-body mt-2 text-sm leading-6 text-slate-600'>
                            You can directly contact the administrator through the details on the parent company website that developed
                            Clinova.
                        </p>
                        <a
                            href='https://pixelpropx.in'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-4 inline-flex items-center justify-center rounded-full border border-[#BCD4F3] px-5 py-2.5 font-body text-sm font-semibold text-[#183B7A] transition hover:bg-[#EAF3FF]'
                        >
                            Visit pixelpropx.in
                        </a>
                    </article>
                </div>

                <div className='mt-8 rounded-2xl border border-[#E2ECF9] bg-white p-5'>
                    <h3 className='font-display text-lg font-bold text-[#12376F]'>
                        Information to include in your request
                    </h3>
                    <ul className='font-body mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600'>
                        <li>Your registered Clinova email address</li>
                        <li>Clinic or organization name</li>
                        <li>Your phone number for verification</li>
                        <li>A short note that you forgot the account password</li>
                    </ul>
                </div>

                <div className='mt-8 flex flex-wrap gap-3'>
                    <Link
                        href='/login'
                        className='inline-flex items-center justify-center rounded-full border border-[#BCD4F3] px-5 py-2.5 font-body text-sm font-semibold text-[#183B7A] transition hover:bg-[#F2F8FF]'
                    >
                        Back to Login
                    </Link>
                    <Link
                        href='/'
                        className='inline-flex items-center justify-center rounded-full border border-[#BCD4F3] px-5 py-2.5 font-body text-sm font-semibold text-[#183B7A] transition hover:bg-[#F2F8FF]'
                    >
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
}
