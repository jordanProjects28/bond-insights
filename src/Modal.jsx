import React from "react";

function Modal({ closeModal }) {
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                    
                <div className="modal-title">
                    <h2>Something Went Wrong</h2>
                </div>

                <div className="modal-body">
                    <p>Please fill all the input fields before pressing the calculate button</p>
                </div>

                <div className="modal-footer">
                    <button onClick={() => closeModal(false)} className="modal-continue-button">Continue</button>
                </div>

            </div>
        </div>
    )
}

export default Modal