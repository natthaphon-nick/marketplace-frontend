import Image from 'next/image';

const testimonials = [
    {
        name: 'Jane Doe',
        role: 'CEO, Acme Corp',
        quote: 'MySaaS transformed our workflow – the performance and UI are outstanding.',
        avatar: '/avatars/jane.svg',
    },
    {
        name: 'John Smith',
        role: 'CTO, BetaTech',
        quote: 'The real‑time analytics gave us insights we never thought possible.',
        avatar: '/avatars/john.svg',
    },
    {
        name: 'Alice Nguyen',
        role: 'Product Manager, Gamma Ltd',
        quote: 'The customizable themes let us keep brand consistency across the platform.',
        avatar: '/avatars/alice.svg',
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-20 bg-white dark:bg-gray-800">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
                    What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <p className="text-gray-600 dark:text-gray-300 mb-4 italic">\"{t.quote}\"</p>
                            <div className="flex items-center space-x-3">
                                <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full" />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{t.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
