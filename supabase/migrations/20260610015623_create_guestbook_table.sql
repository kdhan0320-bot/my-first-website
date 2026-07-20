CREATE TABLE public.guestbook (
  id bigserial PRIMARY KEY,
  author_name text NOT NULL DEFAULT '익명',
  message text NOT NULL,
  affiliation text,
  email text,
  email_public boolean NOT NULL DEFAULT false,
  emoji text DEFAULT '😊',
  keyword text,
  star_rating integer CHECK (star_rating >= 1 AND star_rating <= 5) DEFAULT 5,
  edit_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read"   ON public.guestbook FOR SELECT USING (true);
CREATE POLICY "Public insert" ON public.guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Token update"  ON public.guestbook FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Token delete"  ON public.guestbook FOR DELETE USING (true);
