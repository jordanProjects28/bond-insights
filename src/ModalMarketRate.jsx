import React from "react";

function ModalMarketRate({ closeModal }) {
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                    
                <div className="modal-title">
                    <h2>Something Went Wrong</h2>
                </div>

                <div className="modal-body">
                    <p>The Annual Market Rate can take values from 0.00000000001 to 100</p>
                </div>

                <div className="modal-footer">
                    <button onClick={() => closeModal(false)} className="modal-continue-button">Continue</button>
                </div>

            </div>
        </div>
    )
}

export default ModalMarketRate