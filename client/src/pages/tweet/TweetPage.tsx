import React, { FC } from "react";
import styles from "./TweetPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import XmarkIcon from "../../components/icons/XmarkIcon";

interface TweetPageProps {
    
}

const TweetPage: FC<TweetPageProps> = ({ }) => {

    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className={styles.container}>
                <div className={styles.overlay} onClick={() => {navigate(-1)}}></div>
                <XmarkIcon className={styles.canselBtn} size={'xl'} onClick={() => {navigate(-1)}}/>
                <div className={styles.image}>
                    <img src="https://images.unsplash.com/photo-1554727242-741c14fa561c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" alt="" />
                    <div className={styles.footer}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. .</div>
                </div>
                <div className={styles.comments}>
                    <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis qui fuga laboriosam fugit autem explicabo id cum tempore, culpa, iure in ducimus quos vitae. Possimus dignissimos labore cumque dolorem iusto.</div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TweetPage;

