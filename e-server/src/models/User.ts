import "reflect-metadata";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Article } from "./Articles";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 30, nullable: false })
  name: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  lastname: string;

  @Column({ type: "varchar", length: 120, nullable: false, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password: string;

  @Column({ type: "varchar", length: 11, nullable: false, unique: true })
  cpf: string;

  @Column({ type: "date", nullable: false })
  birth_date: Date;

  @Column({ type: "varchar", length: 255, nullable: false })
  profile_picture_public_id: string;

  @Column({ type: "varchar", length: 512, nullable: false })
  profile_picture: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @CreateDateColumn({ name: "created_at", type: 'datetime' })
  created_at: Date;
  
  @UpdateDateColumn({ name: "updated_at", type: 'datetime' })
  updated_at: Date;
}
