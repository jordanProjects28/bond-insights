import { useState, useEffect } from "react"
import Modal from "./Modal"
import ModalMarketRate from "./ModalMarketRate";

const MainSection = () => {

    const [openModal, setOpenModal] = useState(false);
    const [openModalRate, setOpenModalRate] = useState(false);

    const [paymentInterval,setPaymentInterval] = useState({
        Annual: true,
        Semiannual: false,
        Quarterly: false,
        Monthly: false
    })

    const handlePaymentInterval = (e) => {
        //console.log(e.target.innerText)
        const selectedInterval = e.target.innerText;

        const updatedInterval = {};

        for (let key in paymentInterval) {
            updatedInterval[key] = false;
        }

        updatedInterval[selectedInterval] = true;

        setPaymentInterval(updatedInterval);

    }

    //Runs on mount + when value changes 
    useEffect(() => {
        //console.log(paymentInterval);
    }, [paymentInterval]);

    const [formValues,setFormValues] = useState({
        faceValue: 1000,
        annualCouponRate: 5,
        annualMarketRate: 6,
        maturity: 10
    })

    const [bondPrice, setBondPrice] = useState(null);
    const [bondDuration,setBondDuration] = useState(null);
    const [bondConvexity,setBondConvexity] = useState(null);

    const handleKeyDown = (e) => {
        if (["e", "E", "+", "-"].includes(e.key)){
            e.preventDefault();
        }
    };

    const preventPaste = (e) => {
        e.preventDefault();
    };

    const handleCalculateBtn = () => {
        
        //Object.keys returns an array with the keys
        //find method returns the value of the first element that passes a test.
        const interval =  Object.keys(paymentInterval).find((key) => paymentInterval[key]) //return the one that has the value: true
        //console.log(interval)

        const faceValue = parseFloat(formValues.faceValue);
        const annualCouponRate = parseFloat(formValues.annualCouponRate);
        const annualMarketRate = parseFloat(formValues.annualMarketRate);
        const maturity = parseFloat(formValues.maturity)

        //console.log(`maturity :"${maturity}"`) // type when input is empty : NaN 

        if(isNaN(faceValue) || isNaN(annualCouponRate) || isNaN(annualMarketRate) || isNaN(maturity)){
            setOpenModal(true);
            return
        }

        if(annualMarketRate < 0.00000000001){
            setOpenModalRate(true);
            return
        }

        let periodsPerYear;
        switch(interval){
            case "Annual":
            periodsPerYear = 1 
            break;

            case "Semiannual":
            periodsPerYear = 2                
            break;

            case "Quarterly":
            periodsPerYear = 4
            break;

            case "Monthly":
            periodsPerYear = 12
            break;

        }

        const n =  maturity  * periodsPerYear
        const i = (annualCouponRate / 100) / periodsPerYear
        const y = (annualMarketRate/100) / periodsPerYear
        const C =  i * faceValue
        const F = faceValue

        const couponPV = C * (1/y) * (1-(1/Math.pow(1 + y,n)));
        const facePV = F / Math.pow(1 + y,n)
        console.log(`Present Value of coupons is : ${couponPV.toFixed(2)}`, `Present Value of face value: ${facePV.toFixed(2)}`)
        const P = couponPV + facePV

        let D_num = 0; // numerator
        
        for (let t = 1; t <= n; t++) {
            const cashFlow = (t === n) ? (C + F) : C;
            const pv = cashFlow / Math.pow(1 + y, t);
            D_num += t * pv;
        }

        let durationInPeriods = D_num / P;
        const D = durationInPeriods / periodsPerYear;

        let C_num = 0;

        for (let t = 1; t <= n; t++){
            const cashFlow = (t===n) ? (C+F) : C;
            const pv = cashFlow / Math.pow(1 + y, t);
            C_num += pv * t * (t + 1)
        }

        let convexityInPeriods = C_num / (Math.pow(1 + y, 2) * P)
        const Convexity = convexityInPeriods / (Math.pow(periodsPerYear, 2))

        setBondPrice(P);
        setBondDuration(D);
        setBondConvexity(Convexity);
    }
    
    useEffect(()=>{
        if(formValues.faceValue > 1000000000){
            setFormValues({...formValues, faceValue: 1000000000})
        }else if(formValues.annualCouponRate > 100){
            setFormValues({...formValues, annualCouponRate: 100})
        }else if(formValues.annualMarketRate > 100){
                setFormValues({...formValues, annualMarketRate: 100})
        }else if(formValues.maturity > 100){
            setFormValues({...formValues, maturity: 100})
        }
    },[formValues])

     useEffect(()=>{        
    },[bondPrice])

     useEffect(()=>{        
    },[bondDuration])

    useEffect(() =>{

    },[bondConvexity])

    const handleResetBtn = () => {

        setFormValues({
        faceValue: 1000,
        annualCouponRate: 5,
        annualMarketRate: 6,
        maturity: 10
        })

        setBondPrice(null);
        setBondDuration(null);
        setBondConvexity(null);
    }

    return(
        <>
        {openModal && < Modal closeModal={setOpenModal}/>}
        {openModalRate && < ModalMarketRate closeModal={setOpenModalRate}/>}
        <div className="section1">
            <div className="calculator">
                <div className="payment-section">

                <button 
                className={paymentInterval.Annual ? "payment-section-button-checked" : "paymentButton"} 
                onClick={(event) => handlePaymentInterval(event)}>
                Annual
                </button>

                <button 
                className={paymentInterval.Semiannual ? "payment-section-button-checked" : "paymentButton"} 
                onClick={(event) => handlePaymentInterval(event)}>
                Semiannual
                </button>

                <button 
                className={paymentInterval.Quarterly ? "payment-section-button-checked" : "paymentButton"} 
                onClick={(event) => handlePaymentInterval(event)}>
                Quarterly</button>

                <button 
                className={paymentInterval.Monthly ? "payment-section-button-checked" : "paymentButton"} 
                onClick={(event) => handlePaymentInterval(event)}>
                Monthly
                </button>

            </div>
                <table>

                    <tbody>
                    <tr>
                        <td>Face Value ($):</td>
                        <td>
                            <input 
                            type="number"
                            value={formValues.faceValue}
                            onChange={(e) => setFormValues({...formValues, faceValue: e.target.value} )}
                            onKeyDown={handleKeyDown}
                            onPaste={preventPaste}
                            />
                        </td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td>Annual Coupon Rate (%):</td>
                        <td>
                            <input  
                            type="number"
                            value={formValues.annualCouponRate}
                            onChange={(e) => setFormValues({...formValues, annualCouponRate: e.target.value} )}
                            onKeyDown={handleKeyDown}
                            onPaste={preventPaste}
                            />
                        </td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td>Annual Market Rate (%):</td>
                        <td>
                            <input
                            type="number"  
                            value={formValues.annualMarketRate}
                            onChange={(e) => setFormValues({...formValues, annualMarketRate: e.target.value})}
                            onKeyDown={handleKeyDown}
                            onPaste={preventPaste}
                            />
                        </td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td>Years to Maturity:</td>
                        <td>
                        <input
                        type="number"  
                        value={formValues.maturity}
                        onChange={(e) => setFormValues({...formValues, maturity: e.target.value})}
                        onKeyDown={handleKeyDown}
                        onPaste={preventPaste}
                        />
                        </td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td className="output-label" onClick={() => window.open("/bond-insights/Formulas/Bond Price Calculation.pdf", "_blank") }>Current Bond Price:</td>
                        <td className="bond-price-value">{bondPrice !== null ? bondPrice.toFixed(2) : ""}</td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td className="output-label" onClick={() => window.open("/Formulas/Bond Duration Calculation.pdf", "_blank") }>Duration:</td>
                        <td className="bond-duration-value">{bondDuration !== null ? bondDuration.toFixed(2) : ""}</td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td className="output-label"  onClick={() => window.open("/Formulas/Bond Convexity Calculation.pdf", "_blank") }>Convexity:</td>
                        <td className="bond-convexity-value">{bondConvexity !== null ? bondConvexity.toFixed(2) : ""}</td>
                    </tr>
                    </tbody>

                    <tbody>
                    <tr>
                        <td></td>
                        <td><button type="button" className="calculate-btn" onClick={() => handleCalculateBtn()}>Calculate</button></td>
                    </tr>
                    </tbody>
                    
                    <tbody>
                    <tr>
                        <td></td>
                        <td><button type="button" className="reset-btn" onClick={() => handleResetBtn()}>Reset</button></td>
                    </tr>
                    </tbody>

                </table>
            </div>
        </div>
        </>
    )
}

export default MainSection
