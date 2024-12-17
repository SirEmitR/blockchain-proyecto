
import PropTypes from 'prop-types';

const Modal = ({
    children,
    title,
    onClose,
    isOpen,
    label
}) => {

  return (
    <>
    <button onClick={onClose} className='p-2 rounded bg-gray-800 text-white'>{label}</button>
    {
        isOpen && (
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-75'>
            <div className='bg-white text-gray-700 p-4 rounded shadow-lg w-1/2'>
                <h2 className='text-xl font-semibold'>{title}</h2>
                {children}
                <div>
                    <button onClick={onClose} className='p-2 rounded bg-gray-800 text-white'>Cerrar</button>
                </div>
            </div>
            </div>
        )
    }
    </>
  )
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired
};

export default Modal