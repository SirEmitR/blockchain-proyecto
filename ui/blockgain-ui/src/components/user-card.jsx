
import PropTypes from 'prop-types';

const UserCard = ({
    name, id, balance
}) => {
const copyToClipboard = () => {
    navigator.clipboard.writeText(id)
    alert('Copied to clipboard')
}

  return (
    <div className='px-6 py-4 rounded border border-gray-200 text-left'>
        <h2>{name}</h2>
        <p>Balance: {balance}</p>
        <button onClick={copyToClipboard} className='mt-2 px-2 py-1 rounded border border-gray-300 bg-gray-400 font-semibold text-gray-800 w-full'>{id}</button>
    </div>
  )
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired
};

export default UserCard