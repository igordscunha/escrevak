import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("articles")
export class Article {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, nullable: false })
  title: string;

  @Column({ type: "text", nullable: false })
  content: string;

  @Column({ type: "varchar", length: 512, nullable: false })
  image: string;

  @Column({ type: "json", nullable: true })
  tags: string[];

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: "user_id" })
  user: User;
}

