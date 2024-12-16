import { useState } from "react";
import UpdateElectron from "../src/components/update"

function Impresion() {
  const [printers, setPrinters] = useState<{ name: string }[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");

  // Función para obtener la lista de impresoras
  const fetchPrinters = async () => {
    try {
      const availablePrinters = await window.ipcRenderer.getPrinters();
      setPrinters(availablePrinters);
    } catch (error) {
      alert("Error al obtener las impresoras.");
    }
  };

  // Función para manejar la impresión de prueba
  const handleTestPrint = async () => {
    if (!selectedPrinter) {
      alert("Por favor selecciona una impresora antes de imprimir.");
      return;
    }

    const testContent = `
      *********** PRUEBA DE IMPRESIÓN ***********
      Fecha: ${new Date().toLocaleDateString()}
      Hora: ${new Date().toLocaleTimeString()}
      Impresora: ${selectedPrinter}
      ------------------------------------------
      ¡Esta es una prueba exitosa desde React!
      FELICIDADES TE GANASTE UN CARROOOOOOOOOOOO
      ******************************************
    `;

    const options = {
      deviceName: selectedPrinter,
      silent: true,
      printBackground: true,
      content: testContent,  // Pasamos el contenido limpio que queremos imprimir
    };

    try {
      await window.ipcRenderer.print(options);  // Llamamos al handler en el backend
      alert("Prueba de impresión enviada correctamente.");
    } catch (error) {
      alert("Error al realizar la impresión de prueba.");
      console.error("Error al imprimir:", error);
    }
  };

  return (
    <div className="fixed inset-y-0 w-full px-0 pr-8 ml-0 md:px-2 md:pr-14 xl:px-52 xl:ml-32 mt-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Administrador de Impresoras
        </h1>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <button
            onClick={fetchPrinters}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Listar Impresoras
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Impresoras disponibles:
          </h2>
          <ul className="space-y-2">
            {printers.length > 0 ? (
              printers.map((printer, index) => (
                <li key={index}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="printer"
                      value={printer.name}
                      onChange={(e) => setSelectedPrinter(e.target.value)}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    {printer.name}
                  </label>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No hay impresoras disponibles.</p>
            )}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <button
            onClick={handleTestPrint}
            className={`w-full px-4 py-2 rounded-md text-white ${
              selectedPrinter
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } transition`}
            disabled={!selectedPrinter}
          >
            Realizar Prueba de Impresión
          </button>
        </div>

        {selectedPrinter && (
          <p className="mt-4 text-center text-gray-700">
            <strong>Impresora seleccionada:</strong> {selectedPrinter}
          </p>
        )}
      </div>
      <UpdateElectron />
    </div>
  );
}

export default Impresion;
