import RegistrationForm from './RegistrationForm';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10 px-10 max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        Registration
      </h1>
      <RegistrationForm />
    </div>
  );
}
