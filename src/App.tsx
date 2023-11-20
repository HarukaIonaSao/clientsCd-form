import { FiTrash } from 'react-icons/fi'
import { api } from './services/api'
import { useEffect, useState, useRef, FormEvent } from 'react'

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at: string;
}

export default function App() {

  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers();
  }, [])

  async function loadCustomers() {
    const response = await api.get("/customers")
    setCustomers(response.data);
  }

  async function handleSubmit(e:FormEvent){
    e.preventDefault();
    if(!nameRef.current?.value || !emailRef.current?.value) return;

    const response = await api.post("/customer", {
      name:nameRef.current?.value,
      email:emailRef.current?.value
    })

    setCustomers(allCustomers => [...allCustomers,response.data])

    nameRef.current.value = ""
    emailRef.current.value = ""
  }

  async function handleDelete(id:string) {
    try {
      await api.delete("/customer",{
        params:{
          id:id,
        }
      })
      const allCustomers = customers.filter((customer)=> customer.id !== id)
      setCustomers(allCustomers)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full min-h-screen bg-teal-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl ">
        <h1 className="text-4xl font-medium text-white">Clientes</h1>

        <form className="flex flex-col my-6 " onSubmit={handleSubmit}>
          <label className="font-medium text-white">Nome:</label>
          <input type="text"
            placeholder="Digite seu nome completo..." className="w-full mb-5 p-2 rounded" required pattern="^[A-Za-z]{3,}\s[A-Za-z]{2,}$" ref= {nameRef} />
          <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
            Por favor, adicione um nome válido.
          </span>

          <label className="font-medium text-white">Email:</label>
          <input type="email"
            placeholder="Digite seu email..." className="w-full mb-5 p-2 rounded" required pattern="^(?=[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
          " ref= {emailRef}/>          

          <input type="submit" value="Cadastrar" className="curso-pointer w-full p-2 bg-green-500 rounded font-medium" />
        </form>

        <section className="flex flex-col gap-4">

          {customers.map((customer) => (
            <article key={customer.id} className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
              <p><span className="font-medium">Nome:</span> {customer.name}</p>
              <p><span className="font-medium">Email:</span>{customer.email}</p>
              <p><span className="font-medium">Status:</span>{customer.status ? "ATIVO" : "INATIVO"}</p>

              <button className="bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-0 -top-2" onClick={ () => handleDelete(customer.id)}>
                {/* botao com a estilização */}
                <FiTrash size={18} color="#fff" />
              </button>
            </article>
          ))}

        </section>

      </main>

    </div>
  )
}