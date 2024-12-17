import { useEffect, useState } from 'react'
import './App.css'
import Modal from './components/modal'
import UserCard from './components/user-card'

function App() {

  const [openCreateUser, setOpenCreateUser] = useState(false)
  const [openTransaction, setOpenTransaction] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [state, setState] = useState([])
  useEffect(() => {
    fetch('http://127.0.0.1:5000/state')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setState(data)
    })
  }, [refresh])

  const handleCreateUser = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const balance = e.target.balance.value
    fetch('http://localhost:5000/add_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, balance})
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setRefresh(!refresh)
      setOpenCreateUser(!openCreateUser)
    })
  }

  const handleTransaction = (e) => {
    e.preventDefault()
    const idEmiter = e.target['id-emiter'].value
    const amountEmiter = e.target['amount'].value
    const idReceptor = e.target['id-receptor'].value
    fetch('http://localhost:5000/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        [idEmiter]: Number(amountEmiter) * -1,
        [idReceptor]: Number(amountEmiter)
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setRefresh(!refresh)
      setOpenTransaction(!openTransaction)
    })
  }

  return (
    <main className='bg-gray-600 w-full min-h-screen p-10'>
      <div className='flex justify-center items-center gap-8'>
        <Modal 
          label='Agregar usuario'
          title='Agregar usuario'
          isOpen={openCreateUser}
          onClose={() => setOpenCreateUser(!openCreateUser)}  
        >
          <form onSubmit={handleCreateUser} className='my-4'>
            <input type='text' name='name' placeholder='Nombre' className='w-full p-2 rounded border border-gray-300 bg-white text-gray-900' />
            <input type='number' name='balance' placeholder='Balance' className='w-full p-2 rounded border border-gray-300 bg-white text-gray-900 mt-2' />
            <button type='submit' className='mt-2 px-2 py-1 rounded border-2 border-blue-500 bg-gray-700  font-semibold text-blue-500'>Agregar</button>
          </form>
        </Modal>
        <Modal 
          label='Transaccion'
          title='Nueva transaccion'
          isOpen={openTransaction}
          onClose={() => setOpenTransaction(!openTransaction)}  
        >
          <form onSubmit={handleTransaction} className='my-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-center'>Emitente</p>
                <input type='text' name='id-emiter' placeholder='Id' className='w-full p-2 rounded border border-gray-300 bg-white text-gray-900' />
              
              </div>
              <div>
                <p className='text-center'>Receptor</p>
                <input type='text' name='id-receptor' placeholder='Id' className='w-full p-2 rounded border border-gray-300 bg-white text-gray-900' />
              </div>
            
            </div>
            <input type='number' name='amount' placeholder='Cantidad' className='w-full p-2 rounded border border-gray-300 bg-white text-gray-900 mt-2' />
            <button type='submit' className='mt-2 px-2 py-1 rounded border-2 border-blue-500 bg-gray-700  font-semibold text-blue-500'>Transferir</button>
          </form>
        </Modal>
      </div>
      <div className='grid gap-4 grid-cols-2 mt-4'>
        {
          state.map((user) => (
            <UserCard key={user.id} {...user} />
          ))
        }
      </div>
      
    </main>
  )
}

export default App
