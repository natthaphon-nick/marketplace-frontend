import Image from 'next/image';

const features = [
    {
        title: 'Scalable Architecture',
        description: 'Built to grow with your business, handling millions of users effortlessly.',
        icon: '/icons/scalable.svg',
    },
    {
        title: 'Real‑time Analytics',
        description: 'Instant insights with live dashboards and customizable reports.',
        icon: '/icons/analytics.svg',
    },
    {
        title: 'Secure & Compliant',
        description: 'Enterprise‑grade security, GDPR, SOC2, and ISO certifications.',
        icon: '/icons/secure.svg',
    },
    {
        title: 'Customizable Themes',
        description: 'Easily adapt the look and feel to match your brand.',
        icon: '/icons/theme.svg',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <Image src={feat.icon} alt={feat.title} width={48} height={48} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                {feat.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {feat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
