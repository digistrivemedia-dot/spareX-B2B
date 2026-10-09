/**
 * Column widths shared by the header and every row, so they line up. Rows are laid out by the
 * list's own width: one line from 56rem up; below that the part box and product take a full line
 * each and the numbers wrap underneath.
 */
export const LINE_COLUMNS = {
  row: "flex flex-wrap items-center gap-x-4 gap-y-3 @4xl:flex-nowrap",
  part: "w-full @4xl:w-52 @4xl:shrink-0",
  product: "w-full min-w-0 @4xl:w-auto @4xl:flex-1",
  stock: "@4xl:w-32 @4xl:shrink-0",
  price: "@4xl:w-28 @4xl:shrink-0 @4xl:text-right",
  quantity: "@4xl:w-32 @4xl:shrink-0",
  total: "ml-auto text-right @4xl:ml-0 @4xl:w-28 @4xl:shrink-0",
  remove: "@4xl:w-9 @4xl:shrink-0",
};
