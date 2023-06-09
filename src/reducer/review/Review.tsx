/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RootState, useAppDispatch } from '@/app/store';
import ColorTabs from '@/components/ColorTabs';
import CardReview from './CardReview';
import { fetchGetReviewsByUser } from './review.slice';
import { throttle } from '@/utils/utils';
import FromModalReview from './FromModalReview';
import { IReview } from '@/utils/interface';

const tabs = [
  { name: 'Ready to review', isReview: false },
  { name: 'Reviewed', isReview: true },
];
function Review() {
  const [typeReview, setTypeReview] = React.useState<string>(tabs[0].name);
  const [page, setPage] = React.useState<number>(1);
  const dispatch = useAppDispatch();
  const { reviews, errorMessage, isReview } = useSelector(
    (state: RootState) => state.review
  );

  const [isOpenModalFrom, setIsOpenModalFrom] = React.useState<boolean>(false);
  const [targetReview, setTargetReview] = React.useState<IReview>(reviews[0]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTypeReview(newValue);
  };

  const handelClickTargetReview = (i: number) => {
    setIsOpenModalFrom(true);
    setTargetReview(() => ({ ...reviews[i] }));
  };

  React.useEffect(() => {
    const convertIsReview = typeReview === 'Reviewed';
    if (convertIsReview !== isReview) {
      if (!convertIsReview) {
        dispatch(fetchGetReviewsByUser({ page: 1, isReview: false }));
      } else {
        dispatch(fetchGetReviewsByUser({ page: 1, isReview: true }));
      }
    }
    setPage(1);
  }, [typeReview]);

  const fetchPage = () => {
    if (errorMessage || !reviews.length)
      return window.removeEventListener('scroll', tHandler);

    setPage(page + 1);
    if (typeReview === 'Ready to review') {
      return dispatch(fetchGetReviewsByUser({ page: page + 1, isReview: false }));
    }
    return dispatch(fetchGetReviewsByUser({ page: page + 1, isReview: true }));
  };

  const onScroll = () => {
    const heightScroll = window.scrollY + window.innerHeight;

    if (heightScroll > (document.documentElement.scrollHeight * 18) / 20) fetchPage();
  };

  const tHandler = throttle(onScroll, 400);

  React.useEffect(() => {
    if (page === 1 || !errorMessage.length) {
      window.addEventListener('scroll', tHandler);
    }
    return () => window.removeEventListener('scroll', tHandler);
  }, [page, reviews, errorMessage]);

  return (
    <Box ml={1}>
      <ColorTabs
        numberBadge={[]}
        tabs={tabs}
        value={typeReview}
        handleChange={handleChange}
        orientation='horizontal'
        sxTab={{ justifyContent: 'center', minWidth: 150, p: 0 }}
      />
      {reviews.length ? (
        reviews.map((review, i) => (
          <Box mt={2} key={i}>
            <CardReview review={review} handelClick={handelClickTargetReview} i={i} />
          </Box>
        ))
      ) : (
        <Box>
          <Typography>No review</Typography>
        </Box>
      )}
      <FromModalReview
        key={targetReview?.slug}
        setIsOpenModal={setIsOpenModalFrom}
        isOpenModal={isOpenModalFrom}
        review={targetReview}
      />
    </Box>
  );
}

export default Review;
