const colorClasses = {
  green:
    "bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
  yellow:
    "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500",
  orange:
    "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600",
  blue: "bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
};

type ButtonColor = keyof typeof colorClasses;

interface IButtonProps {
  name: string;
  color: ButtonColor;
  handleOnClick: () => void;
}

function ConnectButton({ name, color, handleOnClick }: IButtonProps) {
  return (
    <button
      type="button"
      onClick={handleOnClick}
      className={`text-white font-medium rounded-lg text-sm px-4 py-2 text-center cursor-pointer ${
        colorClasses[color] || ""
      }`}
    >
      {name}
    </button>
  );
}

export default ConnectButton;
