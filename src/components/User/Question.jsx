import { useState } from 'react';
import Lightbox from "react-awesome-lightbox";
import _ from 'lodash';

const Question = (props) => {
    const { data, index } = props;
    const [isPreviewImg, setIsPreviewImg] = useState(false);
    const [dataImgPreview, setDataImgPreview] = useState({ url: '', title: '' });

    if (_.isEmpty(data)) {
        return (<></>);
    }

    const handlePreviewImg = () => {
        setDataImgPreview({
            url: `data:image/jpeg;base64,${data.image}`,
            title: data.imageName
        });
        setIsPreviewImg(true);
    }

    const handleHanleCheckBox = (event, aId, qId) => {
        props.handleCheckBox(aId, qId);
    }

    return (
        <>
            {data.image ? (
                <div className="quiz-image">
                    <img
                        src={`data:image/jpeg;base64,${data.image}`}
                        onClick={handlePreviewImg}
                        alt={data.imageName}
                    />
                    <span>{data.imageName}</span>
                </div>
            ) : (
                <div className="quiz-image"></div>
            )}

            <div className="question">
                Question {index + 1}: {data.questionDescription} ?
            </div>

            <div className="answer">
                {data.answers && data.answers.length && data.answers.map((a, index) => {
                    return (
                        <div key={`answer-${index}`} className="a-child">
                            <div className="form-check">
                                <input
                                    onChange={(event) => handleHanleCheckBox(event, a.id, data.questionId)}
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={a.isSelected}
                                />
                                <label className="form-check-label">
                                    {a.description}
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isPreviewImg && (
                <Lightbox
                    image={dataImgPreview.url}
                    title={dataImgPreview.title}
                    onClose={() => setIsPreviewImg(false)}
                />
            )}
        </>
    );
}

export default Question;
