"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye, User } from "lucide-react"
import { FontSizeAdjuster } from "@/components/shadcn/font-size-adjuster"
import type { SongWithUser, UserSession } from "@/types/song"

interface SongCardProps {
  song: SongWithUser
  session: UserSession
  onDelete?: (id: string) => void
}

export function SongCard({ song, session, onDelete }: SongCardProps) {
  const isAuthenticated = !!session.user

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <div>
            <span className="block text-xl font-bold">{song.title}</span>
            <span className="block text-sm text-muted-foreground mt-1">{song.artist}</span>
          </div>
          <FontSizeAdjuster />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {song.tags &&
            song.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Badge variant="outline">{song.category}</Badge>
          <Badge variant="outline">{song.language}</Badge>
        </div>
        {song.user && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <User size={14} />
            <span>{song.user.display_name || song.user.username}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Link href={`/songs/${song.id}`} passHref>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye size={16} />
            <span>View</span>
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/songs/edit/${song.id}`}
            passHref
            aria-disabled={!isAuthenticated}
            tabIndex={!isAuthenticated ? -1 : undefined}
            className={!isAuthenticated ? "pointer-events-none opacity-50" : ""}
          >
            <Button variant="outline" size="sm" className="flex items-center gap-1" disabled={!isAuthenticated}>
              <Pencil size={16} />
              <span>Edit</span>
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onDelete && onDelete(song.id)}
            disabled={!isAuthenticated}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
