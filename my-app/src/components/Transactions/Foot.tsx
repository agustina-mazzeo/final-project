import { Pagination } from "../../utils/types";
import Button from "../Shared/UI/Button";
type FootProps = {
  pagination: Pagination;
  changePageHandler: (action: string) => void;
  isLoading: boolean;
};
function Foot({ pagination, changePageHandler, isLoading }: FootProps) {
  return (
    <>
      {pagination.totalPages !== 0 && (
        <tfoot>
          <tr>
            <td
              style={{ textAlign: "center" }}
              colSpan={5}
            >{`Page ${pagination.currentPage} of ${pagination.totalPages}`}</td>
          </tr>
          <tr>
            <th style={{ textAlign: "center" }} colSpan={5}>
              <Button
                disabled={
                  !pagination || pagination.currentPage === 1 || isLoading
                }
                buttonLabel="Previous Page"
                onClick={() => changePageHandler("prev")}
              />
              <Button
                disabled={!pagination || !pagination.hasMorePages || isLoading}
                buttonLabel="Next Page"
                onClick={() => changePageHandler("next")}
              />
            </th>
          </tr>
        </tfoot>
      )}
    </>
  );
}
export default Foot;
