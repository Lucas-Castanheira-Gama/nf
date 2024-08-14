export default function Footer() {
    return (
        <footer className="bg-blue-600 text-white p-6">
            <div className="container mx-auto text-center md:text-left md:flex justify-between">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold">Site em beta</h3>
                    <p>© 2024 Todos os direitos reservados.</p>
                </div>
                <div>
                    <ul className="md:flex md:space-x-8">
                        <li><a href="#" className="block py-2 md:py-0">Privacidade</a></li>
                        <li><a href="#" className="block py-2 md:py-0">Termos de Uso</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
