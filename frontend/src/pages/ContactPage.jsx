export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">İletişim</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Sorularınız için bize ulaşın.
      </p>
      <ul className="space-y-2">
        <li><strong>E-posta:</strong> destek@kairamarkt.com</li>
        <li><strong>Telefon:</strong> 0850 XXX XX XX</li>
      </ul>
    </div>
  );
}
