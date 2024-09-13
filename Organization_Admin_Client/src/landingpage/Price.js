import React, { useState } from 'react';
import './Price.css';
import Tick from '../assets/tick.png';
import Cross from '../assets/wrong.png';
import TickSelect from '../assets/tickselect.png';
import CrossSelect from '../assets/wrongselect.png';

const Price = () => {
    // Initialize state for selected features and selected plan
    const [selectedFeatures, setSelectedFeatures] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Handle feature selection
    const handleSelect = (feature) => {
        setSelectedFeatures((prev) => ({
            ...prev,
            [feature]: !prev[feature]
        }));
    };

    // Handle plan selection
    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    // List of features
    const features = [
        'Unique Access ID',
        'Maintaining Health Record',
        'Medical Camp',
        'Medicines',
        'Nutrition Screening',
        'MediKit',
        'Awareness Program',
        'Treatment Reduction',
        'Group Counseling',
        'BP Apparatus',
        'Individual Counseling',
        'Pulse Oximeter -1',
        'Summer Camps',
        'Awareness Program for Teachers and Parents'
    ];

    // Define which features get tick icons for each plan
    const tickFeatures = {
        basic: [
            'Unique Access ID',
            'Maintaining Health Record',
            'Medical Camp',
            'Medicines',
            'Nutrition Screening',
            'MediKit'
        ],
        standard: [
            'Unique Access ID',
            'Maintaining Health Record',
            'Medical Camp',
            'Medicines',
            'Nutrition Screening',
            'MediKit',
            'Awareness Program',
            'Treatment Reduction',
            'Group Counseling',
            'BP Apparatus'
        ],
        premium: [
            'Unique Access ID',
            'Maintaining Health Record',
            'Medical Camp',
            'Medicines',
            'Nutrition Screening',
            'MediKit',
            'Awareness Program',
            'Treatment Reduction',
            'Group Counseling',
            'BP Apparatus',
            'Individual Counseling',
            'Pulse Oximeter -1',
            'Summer Camps',
            'Awareness Program for Teachers and Parents'
        ]
    };

    const planContent = {
        basic: {
            name: 'BASIC',
            description: 'Ideal for small teams or organizations with moderate needs',
            price: '₹299',
            features: features
        },
        standard: {
            name: 'STANDARD',
            description: 'Ideal for small teams or organizations with moderate needs',
            price: '₹499',
            features: features
        },
        premium: {
            name: 'PREMIUM',
            description: 'Best for large organizations with comprehensive needs',
            price: '₹799',
            features: features
        }
    };

    return (
        <div className="container plan">
            <div className="header plan-header">
                <h1>
                    <div>Our plan Details for your</div>
                    <div className="highlight plan-highlight">Organization</div>
                    <div class="choose-plan">Choose a plan that's right for you</div>
                </h1>
            </div>
            <div className="grid plan-grid">
                <div
                    className={`grid-item plan-grid-item basic ${selectedPlan === 'basic' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('basic')}
                >
                    <h2>{planContent.basic.name}</h2>
                    <p>{planContent.basic.description}</p>
                    <a className='price'>{planContent.basic.price}</a> <a style={{width:'57px',height:'22px',marginTop:'-300px'}}>/Month</a>
                    <ul>
                        {features.map((feature, index) => (
                            <li key={index} onClick={() => handleSelect(feature)}>
                                <img
                                    src={selectedFeatures[feature]
                                        ? (tickFeatures.basic.includes(feature) ? TickSelect : CrossSelect)
                                        : (tickFeatures.basic.includes(feature) ? Tick : Cross)}
                                    alt={`Icon for ${feature}`}
                                />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="get-started-button plan-started-button">Get Started Now</button>
                </div>
                <div
                    className={`grid-item standard plan-grid-item ${selectedPlan === 'standard' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('standard')}
                >
                    <h2>{planContent.standard.name}</h2>
                    <p>{planContent.standard.description}</p>
                    <a className='price'>{planContent.standard.price}</a> <a>/Month</a>
                    <ul>
                        {features.map((feature, index) => (
                            <li key={index} onClick={() => handleSelect(feature)}>
                                <img
                                    src={selectedFeatures[feature]
                                        ? (tickFeatures.standard.includes(feature) ? TickSelect : CrossSelect)
                                        : (tickFeatures.standard.includes(feature) ? Tick : Cross)}
                                    alt={`Icon for ${feature}`}
                                />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="get-started-button plan-started-button">Get Started Now</button>
                </div>
                <div
                    className={`grid-item premium plan-grid-item ${selectedPlan === 'premium' ? 'selected' : ''}`}
                    onClick={() => handlePlanSelect('premium')}
                >
                    <h2>{planContent.premium.name}</h2>
                    <p>{planContent.premium.description}</p>
                    <a className='price'>{planContent.premium.price}</a> <a>/Month</a>
                    <ul>
                        {features.map((feature, index) => (
                            <li key={index} onClick={() => handleSelect(feature)}>
                                <img
                                    src={selectedFeatures[feature]
                                        ? (tickFeatures.premium.includes(feature) ? TickSelect : CrossSelect)
                                        : (tickFeatures.premium.includes(feature) ? Tick : Cross)}
                                    alt={`Icon for ${feature}`}
                                />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="get-started-button plan-started-button">Get Started Now</button>
                </div>
            </div>
        </div>
    );
};

export default Price;
