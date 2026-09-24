import { useParams } from "react-router-dom";

const testList = [
  { id: 1, title: "test1" },
  { id: 2, title: "test2" },
  { id: 3, title: "test3" },
  { id: 4, title: "test4" },
];

const RestaurantDetails = () => {
  const { id } = useParams();

    if (Number(id) === testList[0].id) {
        return (<>JAG ÄR ID {id}, {testList[0].title}</>)
    }

  return (
    <>
      <p>HEEJ!!!</p>
    </>
  );
};

export default RestaurantDetails;
