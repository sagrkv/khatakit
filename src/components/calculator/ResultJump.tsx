import ToolIcon from '../ui/ToolIcon';

/**
 * Jumps past the form to the result below it. CSS shows it only where results sit
 * under the form, so the server and client render the same markup at every width.
 */
export default function ResultJump({ target }: { target: string }) {
  return (
    <a className="button button-primary result-jump" href={`#${target}`}>
      See result <ToolIcon name="arrow-down" />
    </a>
  );
}
