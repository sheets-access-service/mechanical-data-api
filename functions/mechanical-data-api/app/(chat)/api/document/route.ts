import { auth } from '@/app/(auth)/auth';
import type { ArtifactKind } from '@/components/artifact';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from '@/lib/db/queries';
import { ChatSDKError } from '@/lib/errors';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api', 'Missing document ID.').toResponse();
  }

  const session = await auth();
  if (!session?.user) {
    return new ChatSDKError('unauthorized:document').toResponse();
  }

  const documents = await getDocumentsById({ id });
  const [document] = documents;

  if (!document) {
    return new ChatSDKError('not_found:document').toResponse();
  }

  if (document.userId !== session.user.id) {
    return new ChatSDKError('forbidden:document').toResponse();
  }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new ChatSDKError('bad_request:api', 'Missing document ID.').toResponse();
  }

  const session = await auth();
  if (!session?.user) {
    return new ChatSDKError('unauthorized:document').toResponse();
  }

  const { content, title, kind }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  const existingDocuments = await getDocumentsById({ id });

  if (existingDocuments.length > 0) {
    const [existingDoc] = existingDocuments;

    if (existingDoc.userId !== session.user.id) {
      return new ChatSDKError('forbidden:document').toResponse();
    }
  }

  const saved = await saveDocument({
    id,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  return Response.json(saved, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const timestamp = searchParams.get('timestamp');

  if (!id || !timestamp) {
    return new ChatSDKError('bad_request:api', 'Missing id or timestamp.').toResponse();
  }

  const session = await auth();
  if (!session?.user) {
    return new ChatSDKError('unauthorized:document').toResponse();
  }

  const documents = await getDocumentsById({ id });
  const [document] = documents;

  if (!document || document.userId !== session.user.id) {
    return new ChatSDKError('forbidden:document').toResponse();
  }

  const deleted = await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return Response.json(deleted, { status: 200 });
}
