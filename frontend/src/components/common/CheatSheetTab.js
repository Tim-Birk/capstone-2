import { useRef, useState } from 'react';
import { Button, TabPane, Alert } from 'reactstrap';
import { useReactToPrint } from 'react-to-print';
import { POSITIONS } from '../../helpers';
import PrintableCheatSheet from './PrintableCheatSheet';
import Spinner from './Spinner';
import PrintIcon from '@mui/icons-material/Print';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Link } from 'react-router-dom';
import './CheatSheetTab.css';

const positionArray = ['QB', 'RB', 'WR', 'TE'];
const CheatSheetTab = ({ activeList, list, loading }) => {
  const [alert, setAlert] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const handleCopy = () => {
    let textToCopy = `Fantasy Rankings Assistant
    
    `;

    positionArray.forEach((position) => {
      textToCopy =
        textToCopy +
        `
    ${position} Rankings:
        `;
      activeList[position].positionResults.forEach((r, i) => {
        textToCopy =
          textToCopy +
          `${i + 1}. ${r.player_name}
        `;
      });
    });

    navigator.clipboard.writeText(textToCopy);
    setAlert(!alert);
  };

  if (!activeList) return null;
  return (
    <TabPane tabId='cheat-sheet' key='cheat-sheet'>
      <div className='rankings-container'>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <Alert
              onClose={() => {
                setAlert(false);
              }}
              hidden={!alert}
              color='success'
              className='mt-2 mx-3'
            >
              <div className='d-flex justify-content-between'>
                Player rankings copied to the clipboard.
                <Button onClick={() => setAlert(false)} className='btn-close' />
              </div>
            </Alert>
            <div className='row'>
              <div className='col-md-6'>
                <h3 className='pt-3 px-3 mx-auto mx-md-0'>
                  {list.name}: Cheat Sheet
                </h3>
              </div>
              <div className='col-md-6 d-flex align-items-center justify-content-md-end'>
                <div className='mx-3'>
                  <Button
                    color='info'
                    onClick={handleCopy}
                    className='mx-2'
                    size='sm'
                  >
                    <ContentCopyIcon /> Copy
                  </Button>
                  <Button color='primary' onClick={handlePrint} size='sm'>
                    <PrintIcon /> Print
                  </Button>
                </div>
              </div>
            </div>
            <div className='row rankings-content'>
              {positionArray.map((position) => {
                return (
                  <div className='col-sm-6 col-md-4 col-lg-3'>
                    <h5 className='pt-3 px-3 mx-auto mx-md-3'>
                      {POSITIONS[position].name}
                    </h5>
                    <ol className='mx-auto mx-md-3'>
                      {console.log(activeList)}
                      {activeList[position].map((player) => {
                        return (
                          <li key={player.player_id}>
                            <Link
                              target='_blank'
                              to={`/players/${POSITIONS[position].redux}/${player.player_id}`}
                            >
                              {player.player_name}
                            </Link>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
            <div className='d-none'>
              <PrintableCheatSheet
                ref={componentRef}
                activeList={activeList}
                list={list}
              />
            </div>
          </>
        )}
      </div>
    </TabPane>
  );
};

export default CheatSheetTab;
