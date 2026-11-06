import ActivityIcon from "lucide-react/dist/esm/icons/activity.mjs";
import BlocksIcon from "lucide-react/dist/esm/icons/blocks.mjs";
import BookOpenIcon from "lucide-react/dist/esm/icons/book-open.mjs";
import BookmarkIcon from "lucide-react/dist/esm/icons/bookmark.mjs";
import BoxesIcon from "lucide-react/dist/esm/icons/boxes.mjs";
import Building2Icon from "lucide-react/dist/esm/icons/building-2.mjs";
import ChartColumnIcon from "lucide-react/dist/esm/icons/chart-column.mjs";
import ClipboardListIcon from "lucide-react/dist/esm/icons/clipboard-list.mjs";
import CodeIcon from "lucide-react/dist/esm/icons/code.mjs";
import FileIcon from "lucide-react/dist/esm/icons/file.mjs";
import FileTextIcon from "lucide-react/dist/esm/icons/file-text.mjs";
import LandmarkIcon from "lucide-react/dist/esm/icons/landmark.mjs";
import LayoutTemplateIcon from "lucide-react/dist/esm/icons/layout-template.mjs";
import LifeBuoyIcon from "lucide-react/dist/esm/icons/life-buoy.mjs";
import ListIcon from "lucide-react/dist/esm/icons/list.mjs";
import ListChecksIcon from "lucide-react/dist/esm/icons/list-checks.mjs";
import MailIcon from "lucide-react/dist/esm/icons/mail.mjs";
import MailPlusIcon from "lucide-react/dist/esm/icons/mail-plus.mjs";
import MenuIcon from "lucide-react/dist/esm/icons/menu.mjs";
import MessageSquareIcon from "lucide-react/dist/esm/icons/message-square.mjs";
import PackageIcon from "lucide-react/dist/esm/icons/package.mjs";
import PaletteIcon from "lucide-react/dist/esm/icons/palette.mjs";
import ReceiptIcon from "lucide-react/dist/esm/icons/receipt.mjs";
import TableIcon from "lucide-react/dist/esm/icons/table.mjs";
import TextCursorInputIcon from "lucide-react/dist/esm/icons/text-cursor-input.mjs";
import WalletIcon from "lucide-react/dist/esm/icons/wallet.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import ZapIcon from "lucide-react/dist/esm/icons/zap.mjs";
import type { AiAskQuestion, AiAskToolId } from "@/content/types";

export type QuestionPart = { text: string; clue?: number };

/** How far away something floats: how large it looks, how bright it is at rest, and how far it wanders. */
export const DEPTHS = [
  { scale: 0.7, rest: 0.4, drift: 10 },
  { scale: 0.84, rest: 0.66, drift: 16 },
  { scale: 1, rest: 0.95, drift: 22 },
];

/**
 * Everything the agent can reach for, and where each thing floats, as a percentage of
 * the window. The furthest come first, so the nearest pass in front of them.
 *
 * `wideX` and `wideY` are for a page wide enough to float around the section's text.
 * Below 0 is next to the heading, and above 100 is in the section's bottom padding.
 * Only what no question uses goes there, so that no line runs across the heading, and
 * next to the heading it has to stay outside the middle 74% of the page.
 */
export const TOOL_FIELD: Array<{ id: AiAskToolId; Icon: typeof MailIcon; x: number; y: number; wideX: number; wideY: number; depth: number }> = [
  { id: "themes", Icon: PaletteIcon, x: 88, y: 5, wideX: 5, wideY: -42, depth: 0 },
  { id: "dictionaries", Icon: BookOpenIcon, x: 19, y: 19, wideX: 24, wideY: 24, depth: 0 },
  { id: "reports", Icon: ChartColumnIcon, x: 32, y: 42, wideX: 55, wideY: 58, depth: 0 },
  { id: "logs", Icon: ActivityIcon, x: 32, y: 57, wideX: 94, wideY: 53, depth: 0 },
  { id: "menus", Icon: MenuIcon, x: 88, y: 58, wideX: 4.5, wideY: -8, depth: 0 },
  { id: "emails", Icon: MailIcon, x: 16, y: 58, wideX: 33, wideY: 95, depth: 0 },
  { id: "sql_lists", Icon: TableIcon, x: 69, y: 61, wideX: 95.5, wideY: -8, depth: 0 },
  { id: "layouts", Icon: LayoutTemplateIcon, x: 6, y: 90, wideX: 95, wideY: -42, depth: 0 },
  { id: "blocks", Icon: BlocksIcon, x: 26, y: 94, wideX: 7, wideY: 104, depth: 0 },
  { id: "custom_fields", Icon: TextCursorInputIcon, x: 10, y: 5, wideX: 20, wideY: 74, depth: 1 },
  { id: "pages", Icon: FileIcon, x: 46, y: 7, wideX: 11.5, wideY: -24, depth: 1 },
  { id: "forms", Icon: ClipboardListIcon, x: 42, y: 28, wideX: 71, wideY: 51, depth: 1 },
  { id: "contractors", Icon: Building2Icon, x: 77, y: 29, wideX: 82, wideY: 43, depth: 1 },
  { id: "scripts", Icon: CodeIcon, x: 87, y: 44, wideX: 88.5, wideY: -25, depth: 1 },
  { id: "cost_invoices", Icon: WalletIcon, x: 86, y: 66, wideX: 61, wideY: 83, depth: 1 },
  { id: "sales_invoices", Icon: ReceiptIcon, x: 73, y: 74, wideX: 73, wideY: 94, depth: 1 },
  { id: "tickets", Icon: LifeBuoyIcon, x: 39, y: 76, wideX: 90, wideY: 6, depth: 1 },
  { id: "email_templates", Icon: MailPlusIcon, x: 89, y: 87, wideX: 12, wideY: 48, depth: 1 },
  { id: "custom_lists", Icon: ListIcon, x: 72, y: 95, wideX: 42, wideY: 74, depth: 1 },
  { id: "tasks", Icon: ListChecksIcon, x: 31, y: 5, wideX: 42, wideY: 42, depth: 2 },
  { id: "comments", Icon: MessageSquareIcon, x: 70, y: 11, wideX: 51, wideY: 96, depth: 2 },
  { id: "workflows", Icon: WorkflowIcon, x: 60, y: 21, wideX: 90, wideY: 97, depth: 2 },
  { id: "saved_queries", Icon: BookmarkIcon, x: 53, y: 37, wideX: 30, wideY: 56, depth: 2 },
  { id: "catalog", Icon: PackageIcon, x: 12, y: 39, wideX: 11, wideY: 5, depth: 2 },
  { id: "rules", Icon: ZapIcon, x: 71, y: 46, wideX: 93, wideY: 104, depth: 2 },
  { id: "documents", Icon: FileTextIcon, x: 52, y: 59, wideX: 12, wideY: 95, depth: 2 },
  { id: "companies", Icon: LandmarkIcon, x: 10, y: 73, wideX: 66, wideY: 20, depth: 2 },
  { id: "custom_objects", Icon: BoxesIcon, x: 49, y: 95, wideX: 50, wideY: 20, depth: 2 },
];

export const toolIcon = (id: AiAskToolId) => TOOL_FIELD.find((tool) => tool.id === id)!.Icon;

/** What the rivals for a clue score, best first. A tool's own letters shift it a little, so that no two clues read the same. */
const RIVAL_SCORES = [62, 38, 17];

/** What a tool scores for a clue. Without a rank it is the tool that clue settles on, which always scores highest. */
export function toolScore(id: AiAskToolId, rank?: number) {
  const shift = Array.from(id).reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 9;
  return (rank === undefined ? 90 : RIVAL_SCORES[rank]) + shift;
}

/** The specks behind everything, as one shadow list, across the widest the section gets. They are spread evenly, and without a pattern, by a low-discrepancy sequence. */
export const DUST = Array.from({ length: 120 }, (_, index) => {
  const x = Math.round(((index * 0.7548777) % 1) * 1760);
  const y = Math.round(((index * 0.5698403) % 1) * 1100);
  return `${x}px ${y}px 0 ${index % 3 === 0 ? 1 : 0}px rgb(11 123 190 / ${10 + (index % 4) * 5}%)`;
}).join(", ");

/** The question cut into plain text and the words each clue came from. */
export function splitQuestion(question: AiAskQuestion): QuestionPart[] {
  const marks = question.clues
    .map((clue, index) => ({ at: question.question.indexOf(clue.words), length: clue.words.length, clue: index }))
    .filter((mark) => mark.at >= 0)
    .sort((a, b) => a.at - b.at);

  const parts: QuestionPart[] = [];
  let cursor = 0;
  marks.forEach((mark) => {
    if (mark.at > cursor) parts.push({ text: question.question.slice(cursor, mark.at) });
    parts.push({ text: question.question.slice(mark.at, mark.at + mark.length), clue: mark.clue });
    cursor = mark.at + mark.length;
  });
  if (cursor < question.question.length) parts.push({ text: question.question.slice(cursor) });
  return parts;
}
