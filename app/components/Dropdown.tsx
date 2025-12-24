import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface DropdownItem {
    label: React.ReactNode;       // What appears inside the menu
    onClick?: () => void;         // What happens when clicked
    href?: string;                // Optional: if it's a link
}

interface DropdownProps {
    buttonLabel: React.ReactNode;
    items: DropdownItem[];
    colors?: { bg: string; text: string }; // optional styling
    width?: string; // optional (e.g. "w-28")
}

export default function Dropdown({ buttonLabel, items, colors, width = "w-28" }: DropdownProps) {
    const handleClick = (setValue?: () => void) => {
        if (setValue) setValue();

        // Blur the focused element to close menu
        const elem = document.activeElement;
        if (elem) (elem as HTMLElement).blur();
    };

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="flex btn h-10 min-h-10 items-center gap-1.5 border-none \
                        bg-primary text-primary-dark hover:bg-primary hover:text-primary-dark \
                        dark:bg-primary-dark dark:text-backdrop-dark dark:hover:bg-primary-dark dark:hover:text-backdrop-dark"
                style={ colors
                    ? {
                        backgroundColor: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.text}`,
                    }
                    : undefined
                }
            >
                { buttonLabel }
                <FontAwesomeIcon icon={faCaretDown} />
            </div>

            <ul
                tabIndex={0}
                className={`dropdown-content z-20 menu p-2 shadow bg-section dark:bg-section-dark rounded-md ${width}`}
            >
                { items.map((item, i) => (
                    <li key={ i } onClick={() => handleClick(item.onClick)}>
                        { item.href 
                            ? <Link className="text-center px-2 py-2.5" href={ item.href }>{ item.label }</Link>
                            : <span className="text-center px-4 py-2.5">{ item.label }</span>
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}
