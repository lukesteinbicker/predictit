"use client"

import { useState, useEffect } from 'react';
import { Table, Button } from '@mantine/core';
import { getUserPredictionsAction } from '@/app/actions';
import { useParams } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';


export default function PredictionsList() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const userId = useParams<{ id: string }>()

  const loadPredictions = async () => {
    setLoading(true);
    const newPredictions = await getUserPredictionsAction(userId.id, predictions.length, predictions.length + 9);
    setLoading(false);

    if (newPredictions && newPredictions.length > 0) {
      setPredictions([...predictions, ...newPredictions]);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, [userId.id]);

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  };

  const rows = predictions.map((prediction) => (
    <Table.Tr key={prediction.id}>
      <Table.Td>{prediction.id}</Table.Td>
      <Table.Td>{truncateString(prediction.description, 50)}</Table.Td>
      <Table.Td>{new Date(prediction.created_at).toLocaleString()}</Table.Td>
      <Table.Td>
        <Link href={`/p/${prediction.id}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink />
        </Link>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={1} className="w-full">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Timestamp</Table.Th>
            <Table.Th>Link</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      {hasMore && (
        <Button onClick={loadPredictions} loading={loading} mt="md" fullWidth>
          Load More
        </Button>
      )}
    </Table.ScrollContainer>
  );
}